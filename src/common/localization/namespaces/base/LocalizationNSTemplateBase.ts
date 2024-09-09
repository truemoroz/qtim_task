import { StringHelper } from '@/common/lib/string/StringHelper'

export abstract class LocalizationNSTemplateBase<T> {
    private static readonly SpecSymbolMap: Record<string, string> = {
        '-': '_',
        '/': '_',
    }

    public readonly abstract namespaceTemplate: string

    public abstract getDefaultMessage(item: T): Promise<string>

    async resolveNamespace(data: Record<string, any>): Promise<string> {
        const matches = this.namespaceTemplate.match(/{([A-z0-9._-]+)}/g)
        let resultNamespace = this.namespaceTemplate
        if (matches) {
            for (let i = 0; i < matches.length; i++) {
                const initialPropertyKey = matches[i].replace('{', '').replace('}', '')
                if (data[initialPropertyKey]) {
                    resultNamespace = resultNamespace.replace('{' + initialPropertyKey + '}', data[initialPropertyKey])
                }
            }
        }
        if (resultNamespace) {
            const specSymbols = Object.keys(LocalizationNSTemplateBase.SpecSymbolMap)
            for (let i = 0; i < specSymbols.length; i++) {
                const symbol = specSymbols[i]
                const replace = LocalizationNSTemplateBase.SpecSymbolMap[symbol]
                resultNamespace = StringHelper.replaceAll(symbol, replace, resultNamespace)
            }
        }
        return resultNamespace
    }
}
