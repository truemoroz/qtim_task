import { IApiClient } from '@/services/auth/interfaces/IApiClient'
import core from 'express-serve-static-core'
import { LogData } from '@/common/models/requests/basic/LogData'

export interface ApiRequestData extends core.Request<core.ParamsDictionary, any, any, core.Query, Record<string, any>> {
    apiClient: IApiClient
    logData: LogData
    guid: string
    i18nLang?: string
}
