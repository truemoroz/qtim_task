import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'
import { DataLogType, Log } from '@/common/lib/log/Log'
import { DateTime } from 'ts-luxon'
import colors from '@colors/colors'
import { IApiClient } from '@/common/interfaces/auth/IApiClient'
import { apiClientTypeNames } from '@/common/models/auth/ApiClientType'

export type RequestLogLevel = 'log' | 'warn' | 'error'

export abstract class RequestLoggerBase {

    private static borderStart = '-'.repeat(15)
    private static borderEnd = '*'.repeat(15)

    protected getApiClientLogData(client: IApiClient): Record<string, any> {
        const clientType = apiClientTypeNames[client.type]
        return {
            ...client.getFullIdentificationData(),
            clientType,
            client: client.constructor.name,
            lang: client.lang,
        }
    }

    protected isQueryExists(request: ApiRequestData): boolean {
        return !!Object.keys(request.query).length
    }

    protected isRequestBodyExists(request: ApiRequestData): boolean {
        return request.logData && request.logData.logBody && !!Object.keys(request.logData.logBody).length
    }

    protected getResponseBodyLogData(body: Record<string, any>): DataLogType {
        return Log.GetLog(body)
    }

    protected getRequestExecutionTime(request: ApiRequestData): number {
        let startTime: DateTime
        if (request.logData && request.logData.requestAcceptTime) {
            startTime = request.logData.requestAcceptTime
        } else {
            startTime = DateTime.now()
        }

        return DateTime.now().toMillis() - startTime.toMillis()
    }

    protected getAcceptedMessage(request: ApiRequestData): string {
        return colors.green(`${RequestLoggerBase.borderStart} ${colors.grey(request.guid)} ${RequestLoggerBase.borderStart}`)
    }

    protected getCompetedMessage(request: ApiRequestData): string {
        return colors.green(`${RequestLoggerBase.borderEnd} ${colors.grey(request.guid)} ${RequestLoggerBase.borderEnd}`)
    }
}
