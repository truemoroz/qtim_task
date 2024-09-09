import { Injectable, OnModuleInit } from '@nestjs/common'
import { I18nService, TranslateOptions } from 'nestjs-i18n'
import { DateTime } from 'ts-luxon'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { LocalizationModelStorage } from '@/services/localization/storage/LocalizationModelStorage'
import { ModuleRef } from '@nestjs/core'
import { ILocalizationResolver } from '@/services/localization/interfaces/ILocalizationResolver'
import { ILocalizationNS } from '@/common/localization/interfaces/ILocalizationNS'
import { LocalizationRefreshService } from '@/services/localization/refresh/localization-refresh.service'

@Injectable()
export class LocalizationService implements OnModuleInit {
    public static readonly modelStorage = new LocalizationModelStorage()

    private static readonly RefreshTime = 1 //minutes

    private lastRefresh: DateTime
    private existsHandlers: { type: Constructor<any>, instance: ILocalizationResolver }[] = []

    constructor(
        private readonly i18n: I18nService,
        private readonly moduleRef: ModuleRef,
        private readonly localizationRefreshService: LocalizationRefreshService,
    ) {
    }

    async onModuleInit(): Promise<void> {
        const items = Object.values(LocalizationService.modelStorage.items)
        for (let i = 0; i < items.length; i++) {
            const item = items[i]
            const propertyKeys = Object.keys(item)
            for (let j = 0; j < propertyKeys.length; j++) {
                const key = propertyKeys[j]
                const property = item[key]
                if (!property.localizationResolver) {
                    continue
                }
                const existsHandler = this.existsHandlers.find(p => p.type == property.localizationResolver)
                if (existsHandler) {
                    property.localizationResolverInstance = existsHandler.instance
                } else {
                    property.localizationResolverInstance = await this.moduleRef.create(property.localizationResolver)
                    this.existsHandlers.push({
                        type: property.localizationResolver,
                        instance: property.localizationResolverInstance,
                    })
                }
            }
        }
        try {
            await this.refreshLocalizations()
        } catch (err) {
        }
    }

    async translate<T = string>(key: string | ILocalizationNS, options?: TranslateOptions): Promise<T> {
        if (!this.lastRefresh || DateTime.now().toMillis() > this.lastRefresh.plus({ minutes: LocalizationService.RefreshTime }).toMillis()) {
            await this.i18n.refresh()
            this.lastRefresh = DateTime.now()
        }
        const ns = typeof key == 'string' ? key : key.namespace.join('.')
        return this.i18n.translate(ns, options) as T
    }

    canTranslate(model: Constructor<any>, propertyKey: string): boolean {
        const modelDescriptor = LocalizationService.modelStorage.getItem(model.name, false)
        return !!modelDescriptor && !!modelDescriptor[propertyKey]
    }

    async translateModel(model: Constructor<any>, initialData: Record<string, any>, propertyKey: string, initialValue: any, lang?: string): Promise<string> {
        const modelDescriptor = LocalizationService.modelStorage.getItem(model.name, false)
        if (!modelDescriptor || !modelDescriptor[propertyKey]) {
            return initialValue
        }
        const propertyDescriptor = modelDescriptor[propertyKey]

        const resolverResult = await propertyDescriptor.localizationResolverInstance.localize(propertyDescriptor, initialData, lang)
        return resolverResult || initialValue
    }

    async refreshLocalizations(defaultLanguage?: string): Promise<void> {
        await this.localizationRefreshService.updateLocalizations(defaultLanguage)
    }
}
