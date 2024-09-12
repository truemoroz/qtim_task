import core from 'express-serve-static-core'
import { LogData } from '@/common/models/requests/basic/LogData'
import { IApiClient } from '@/common/interfaces/auth/IApiClient'

export interface ApiRequestData extends core.Request<core.ParamsDictionary, any, any, core.Query, Record<string, any>> {
    apiClient: IApiClient
    logData: LogData
    guid: string
    i18nLang?: string
}
