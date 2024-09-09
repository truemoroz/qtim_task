import { Inject } from '@nestjs/common'
import { lstatSync, readdirSync, readFileSync } from 'fs'
import { I18N_LOADER_OPTIONS, I18nLoader, I18nTranslation } from 'nestjs-i18n'
import path from 'path'
import { I18nAbstractLoaderOptions } from 'nestjs-i18n/dist/loaders/i18n.abstract.loader'
import { PathHelper } from '@/common/lib/path/PathHelper'
import { LocalizationNamespaceStorage } from '@/common/memory-data-storage/storages/LocalizationNamespaceStorage'

export class I18nCustomParser extends I18nLoader {

    private static readonly DbLanguageMap: Record<string, string> = {
        'en-US': 'en',
        'ru-RU': 'ru',
    }

    private readonly translations: Record<string, any>

    constructor(
        @Inject(I18N_LOADER_OPTIONS)
        private options: I18nAbstractLoaderOptions,
    ) {
        super()
        this.translations = {}
    }

    async languages(): Promise<string[]> {
        return Object.keys(this.translations)
    }

    async load(): Promise<I18nTranslation> {
        const patch = this.options.path
        await this.getFromPath(patch, [])

        const namespaces = await LocalizationNamespaceStorage.getInstance().getValues()

        for (let i = 0; i < namespaces.length; i++) {
            const namespace = namespaces[i]
            if (namespace.messages) {
                for (let j = 0; j < namespace.messages.length; j++) {
                    const message = namespace.messages[j]
                    const language = I18nCustomParser.DbLanguageMap[message.language] ?? message.language
                    PathHelper.insertValueByKeyPath(this.translations, language + '.' + namespace.namespace, message.message)
                }
            }
        }

        return this.translations
    }

    async getFromPath(basePath: string, namespace: string[]): Promise<any> {
        const dir = readdirSync(basePath).map(p => path.join(basePath, p))
        const folders = dir.filter(p => lstatSync(p).isDirectory())
        const files = dir.filter(p => lstatSync(p).isFile())
        for (let i = 0; i < folders.length; i++) {
            const ns = folders[i].replace(basePath, '').replace('/', '').replace('\\', '')
            const newNs = [...namespace]
            newNs.push(ns)
            await this.getFromPath(folders[i], newNs)
        }

        for (let i = 0; i < files.length; i++) {
            const extension = path.extname(files[i])
            const lang = path.basename(files[i], extension)
            if (!this.translations[lang]) {
                this.translations[lang] = {}
            }
            namespace.reduce((previousValue, currentValue, index) => {
                if (previousValue[currentValue]) {
                    return previousValue[currentValue]
                }
                previousValue[currentValue] = {}
                if (index === namespace.length - 1) {
                    previousValue[currentValue] = JSON.parse(readFileSync(files[i], 'utf8'))
                }
                return previousValue[currentValue]
            }, this.translations[lang])
        }
    }
}
