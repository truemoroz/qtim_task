import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common'
import { Setting } from '@/common/models/database/Setting'
import { SettingValue, SettingValueTypeEnum } from '@/common/models/database/SettingValue'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ISettingGroup } from '@/services/settings/interfaces/ISettingGroup'
import { ISettingDescriptor } from '@/services/settings/interfaces/ISettingDescriptor'
import { Cache } from 'cache-manager'
import { PathDependencyLoader } from '@/common/lib/moduleLoading/PathDependencyLoader'
import path from 'path'
import { BaseSettingDescriptor } from '@/services/settings/descriptors/BaseSettingDescriptor'
import { SettingDSContext } from '@/data-sources/setting/context/SettingDSContext'
import { SettingDataSource } from '@/data-sources/setting/setting.data-source'

@Injectable()
export class SettingsService {
    classes = PathDependencyLoader.loadClassesFromPathRecursive<ISettingGroup>(
        path.resolve(__dirname, 'groups'), '', 'Settings')
    private readonly CACHE_SETTINGS_PREFIX = 'settings-'

    constructor(
        @Inject(CACHE_MANAGER) private readonly cache: Cache,
        private readonly settingDataSource: SettingDataSource,
    ) {
    }

    async getValues(context: SettingDSContext): Promise<Setting[]> {
        const data = await this.settingDataSource.getAll(context)
        const settingsDescription = this.getSettingsByGroup(context.group)
        const aliases = Object.entries(settingsDescription)
            .reduce((acc, [key, setting]) => ({ ...acc, [setting.name]: key }), {})

        return data.map(setting => {
            setting['dataValues'].alias = aliases[setting.name]
            return setting
        })
    }

    async getRawValue(group: string, name: string, defaultValue: string = null): Promise<any> {
        const setting = await Setting.findOne({
            where: { group, name },
            include: SettingValue,
        })
        if (!SettingsService.valueAvailable(setting)) {
            return defaultValue
        }
        return setting.values[0].value
    }

    async getValue<T extends ISettingGroup, P>(settingGroup: Constructor<T>, descriptor: ISettingDescriptor<P>, defaultValue: P = null): Promise<P> {

        const converterInstance = new descriptor.converter()

        const cacheKey = `${this.CACHE_SETTINGS_PREFIX}${settingGroup.name}.${descriptor.name}`
        const cacheValue = await this.cache.get(cacheKey)
        if (cacheValue != undefined) {
            return converterInstance.serialize(cacheValue.toString())
        }

        const instance = new settingGroup()
        const group = instance.GROUP
        const setting = await Setting.findOne({
            where: { group, name: descriptor.name },
            include: SettingValue,
        })
        if (!SettingsService.valueAvailable(setting)) {
            return defaultValue
        }

        const rawValue = setting.values[0].value
        if (rawValue === null) {
            return defaultValue
        }

        await this.cache.set(cacheKey, rawValue, { ttl: 5 })

        return converterInstance.serialize(rawValue)
    }

    async setValue<T extends ISettingGroup, P>(
        value: P,
        descriptor: ISettingDescriptor<P>,
        settingGroup: Constructor<T>): Promise<void> {
        const instance = new settingGroup()
        const group = instance.GROUP

        const setting = await Setting.query()
            .where({ group, name: descriptor.name })
            .include(SettingValue)
            .getOne()
        const cacheKey = `${this.CACHE_SETTINGS_PREFIX}${settingGroup.name}.${descriptor.name}`
        await this.cache.set(cacheKey, value, { ttl: 5 })
        if (setting.values.length > 0) {
            setting.values[0].value = value.toString()
            await setting.values[0].save()
        } else {
            await SettingValue.create({
                type: SettingValueTypeEnum.GLOBAL,
                value: value.toString(),
                setting_id: setting.id,
            })
        }
    }

    async setValues<T extends ISettingGroup, P>(
        values: Record<string, string | number | boolean>,
        settingGroup: Constructor<T>): Promise<void> {
        for (const key of Object.keys(values)) {
            const descriptor = settingGroup[key]
            if (!descriptor) {
                continue
            }
            await this.setValue(values[key], descriptor, settingGroup)
        }

    }

    getSettingsByGroup<T>(settingsGroup: string): Record<string, BaseSettingDescriptor<T>> {
        const settingsClass = this.classes.find(c => new c().GROUP === settingsGroup)
        if (!settingsClass) {
            return {}
        }

        return Object.keys(settingsClass).reduce((acc, key) => {
            const setting = settingsClass[key]
            if (setting instanceof BaseSettingDescriptor) {
                acc[key] = setting
            }
            return acc
        }, {})
    }


    private static valueAvailable(setting: Setting): boolean {
        return (!!setting && !!setting.values && setting.values.length > 0 && setting.values[0].value !== null)
    }
}
