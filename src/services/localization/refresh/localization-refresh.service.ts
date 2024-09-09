import { Injectable } from '@nestjs/common'
import { Language } from '@/common/models/database/Language'
import { LocalizationNamespace } from '@/common/models/database/LocalizationNamespace'
import { LocalizationMessage, LocalizationMessageCA } from '@/common/models/database/LocalizationMessage'
import { ArrayHelper } from '@/common/lib/array/ArrayHelper'
// import { Dictionary } from '@/common/models/database/Dictionary'
// import { DictionaryItemTitleNSTemplate } from '@/common/localization/namespaces/DictionaryItemTitleNSTemplate'
// import { ProfileFieldDescriptionNSTemplate } from '@/common/localization/namespaces/ProfileFieldDescriptionNSTemplate'
// import { ProfileFieldTitleNSTemplate } from '@/common/localization/namespaces/ProfileFieldTitleNSTemplate'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { LocalizationNSTemplateBase } from '@/common/localization/namespaces/base/LocalizationNSTemplateBase'
import { QueryableModel, QueryableModelCtor } from '@/common/lib/queryBuilder/models/QueryableModel'
import { LTreeType } from '@/common/lib/sequelize/dataTypes/LTree'
import { SettingsService } from '@/services/settings/settings.service'
import { GlobalSettings } from '@/services/settings/groups/GlobalSettings'


@Injectable()
export class LocalizationRefreshService {
    private languages: Language[] = []
    private namespaces: LocalizationNamespace[] = []
    private namespaceMap: Record<string, LocalizationNamespace> = {}

    private readonly modelTemplateMatch = new Map<QueryableModelCtor, Constructor<LocalizationNSTemplateBase<any>>[]>([
        // [Dictionary, [DictionaryTitleNSTemplate]],
    ])

    constructor(
        private readonly settingsService: SettingsService,
    ) {
    }

    public async init(): Promise<void> {
        this.languages = await Language.query().getAll()
        this.namespaces = await LocalizationNamespace.query()
            .include(LocalizationMessage)
            .getAll()
        this.namespaceMap = ArrayHelper.createMap(this.namespaces, 'namespace')
        await LocalizationMessage.destroy({
            where: {
                namespace_id: null,
            },
        })
    }

    public async updateLocalizations(defaultLanguage?: string): Promise<void> {
        await this.init()
        const models = [...this.modelTemplateMatch.keys()]
        for (let i = 0; i < models.length; i++) {
            const model = models[i]
            const templates = this.modelTemplateMatch.get(model)
            for (let j = 0; j < templates.length; j++) {
                const template = templates[j]
                await this.fullUpdateFromModel(template, model, defaultLanguage)
            }
        }
        // const profileFields = await FullProfileHelper.getProfileFields(true)
        // await this.updateFromRawData(ProfileFieldDescriptionNSTemplate, profileFields, defaultLanguage)
        // await this.updateFromRawData(ProfileFieldTitleNSTemplate, profileFields, defaultLanguage)
    }

    public async fullUpdateFromModel(template: Constructor<LocalizationNSTemplateBase<any>>, model: QueryableModelCtor, defaultLanguage?: string): Promise<void> {
        const rawData = await model.query().getAll()
        await this.updateFromRawData(template, rawData, defaultLanguage)
    }

    public async updateFromRawData(template: Constructor<LocalizationNSTemplateBase<any>>, rawData: Record<string, any>[], defaultLanguage?: string, refreshNamespace = false): Promise<void> {
        const templateInstance = new template()
        for (let i = 0; i < rawData.length; i++) {
            const item = rawData[i]
            const ns = await templateInstance.resolveNamespace(item)
            if (ns) {
                const defaultMessage = await templateInstance.getDefaultMessage(item)
                await this.refreshNamespace(ns, defaultMessage, defaultLanguage, refreshNamespace)
            }
        }
    }

    public async updateFromModel<T extends QueryableModel>(modelCtor: QueryableModelCtor<T>, items: T | T[], saveToPlatformLanguage = true): Promise<void> {
        let defaultLanguage: string = undefined
        if (saveToPlatformLanguage) {
            defaultLanguage = await this.settingsService.getValue(GlobalSettings, GlobalSettings.defaultLanguage, GlobalSettings.DEFAULT_LANGUAGE)
        }
        const modelTemplates = this.modelTemplateMatch.get(modelCtor)
        if (modelTemplates) {
            const rawData = Array.isArray(items) ? items : [items]
            for (let i = 0; i < modelTemplates.length; i++) {
                const template = modelTemplates[i]
                await this.updateFromRawData(template, rawData, defaultLanguage, true)
            }
        }
    }

    private async refreshNamespace(namespaceValue: string, defaultMessage: string, defaultLanguage?: string, refreshNamespace = false): Promise<void> {
        let namespace: LocalizationNamespace = this.namespaceMap[namespaceValue]
        if (!namespace || refreshNamespace) {
            if (!namespace) {
                namespace = await LocalizationNamespace.query()
                    .where({
                        namespace: namespaceValue,
                    })
                    .getOne()
            }
            if (!namespace) {
                namespace = await LocalizationNamespace.create({
                    namespace: LTreeType.fromString(namespaceValue),
                })
            }
            namespace = await this.updateNamespace(namespace, refreshNamespace)
        }
        const languageMap = ArrayHelper.createMap(namespace.messages, 'language')
        const messages: LocalizationMessageCA[] = []
        for (let i = 0; i < this.languages.length; i++) {
            const language = this.languages[i]
            const localizationMessage = languageMap[language.id]
            if (!localizationMessage) {
                messages.push({
                    namespace_id: namespace.id,
                    language: language.id,
                    message: defaultLanguage == language.id ? defaultMessage : '',
                })
            } else if (!!localizationMessage && defaultLanguage == language.id) {
                localizationMessage.message = defaultMessage
                messages.push(localizationMessage.toJSON())
            }
        }
        if (messages.length > 0) {
            await LocalizationMessage.bulkCreate(messages, {
                updateOnDuplicate: ['message'],
            })
            await this.updateNamespace(namespace, true)
        }
    }

    private async updateNamespace(namespace: LocalizationNamespace, force = false): Promise<LocalizationNamespace> {
        if (!this.namespaceMap[namespace.namespace.toString()] || force) {
            const dbNamespace = await LocalizationNamespace.query()
                .include(LocalizationMessage)
                .where({
                    id: namespace.id,
                })
                .getOne()
            const existsIndex = this.namespaces.findIndex(p => p.id == namespace.id)
            if (existsIndex > -1) {
                this.namespaces.splice(existsIndex, 1)
            }
            this.namespaces.push(dbNamespace)
            this.namespaceMap = ArrayHelper.createMap(this.namespaces, 'namespace')
        }
        return this.namespaceMap[namespace.namespace.toString()]
    }
}
