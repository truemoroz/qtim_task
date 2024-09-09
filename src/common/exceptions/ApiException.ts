import { HttpException, HttpStatus } from '@nestjs/common'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { IExceptionNS } from '@/common/exceptions/interfaces/IExceptionNS'
import { LocalizationService } from '@/services/localization/localization.service'

export class ApiException extends HttpException {
    readonly code: number = 0
    readonly errorName: string = ''
    readonly ns: Constructor<IExceptionNS>
    params?: Record<string, any>
    data: Record<string, any>
    public readonly baseException: Error

    constructor(baseException?: Error, status: HttpStatus = HttpStatus.BAD_REQUEST) {
        super(null, status)
        if (baseException) {
            this.data = {
                message: baseException.message,
            }
        }
        this.baseException = baseException
    }

    async getDescription(i18n: LocalizationService, lang: string): Promise<string> {
        const resultNs = []
        if (this.ns) {
            const nsInstance = new this.ns()
            nsInstance.namespace.forEach(p => resultNs.push(p))
        }
        const params = { ...this.params }
        resultNs.push(this.errorName)
        const translation = await i18n.translate<Record<string, any>>(resultNs.join('.'), { lang })
        if (params && translation.params) {
            const translatedParams: Record<string, any> = {}
            const paramKeys = Object.keys(params)

            for (let i = 0; i < paramKeys.length; i++) {
                const paramKey = paramKeys[i]
                const paramValue = params[paramKey]
                const paramNs = [...resultNs, 'params', paramKey, paramValue]
                if (translation.params[paramKey] && translation.params[paramKey][paramValue]) {
                    translatedParams[paramKey] = await i18n.translate(paramNs.join('.'), { lang })
                    delete params[paramKey]
                }
            }
            resultNs.push('message')
            return i18n.translate(resultNs.join('.'), { lang, args: { ...translatedParams, ...params } })
        }
        return i18n.translate(resultNs.join('.'), { lang, args: this.params })
    }
}
