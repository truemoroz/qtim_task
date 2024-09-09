import { ArgumentsHost } from '@nestjs/common'
import { RequestLabels } from '@/common/lib/log/request/models/RequestLabels'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'
import { LogMessageType } from '@/common/lib/log/enum/LogMessageType'
import { RequestLoggerBase, RequestLogLevel } from '@/common/lib/log/loggers/base/RequestLoggerBase'
import { IRequestLogger } from '@/common/lib/log/interfaces/IRequestLogger'
import { ExceptionLogger } from '@/common/lib/log/loggers/ExceptionLogger'
import { ApplicationLogger } from '@/common/lib/log/loggers/ApplicationLogger'


export class LabeledRequestLogger extends RequestLoggerBase implements IRequestLogger {

    logSuccessResponse(context: ArgumentsHost, responseData: Record<string, any>): void {
        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<ApiRequestData>()
        const response = httpContext.getResponse()
        const labels = LabeledRequestLogger.getRequestLabels(request, response)

        const logLevel = 'log'

        this.logRequestStart(request, labels, logLevel)
        this.logRequest(request, labels, logLevel)
        this.logResponse(responseData, labels, logLevel)
        this.logResponseInfo(request, response, labels, logLevel)
        this.logRequestEnd(request, labels, logLevel)
    }

    logHandledErrorResponse(context: ArgumentsHost, responseData: Record<string, any>, exception: Record<string, any>): void {
        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<ApiRequestData>()
        const response = httpContext.getResponse()
        const labels = LabeledRequestLogger.getRequestLabels(request, response)

        const logLevel = 'log'

        this.logRequestStart(request, labels, logLevel)
        this.logRequest(request, labels, logLevel)

        const exceptionLogger = new ExceptionLogger()
        exceptionLogger.logException(exception, labels, logLevel, false)

        this.logResponse(responseData, labels, logLevel)
        this.logResponseInfo(request, response, labels, logLevel)
        this.logRequestEnd(request, labels, logLevel)
    }

    logCriticalErrorResponse(context: ArgumentsHost, responseData: Record<string, any>, exception: Record<string, any>): void {
        const httpContext = context.switchToHttp()
        const request = httpContext.getRequest<ApiRequestData>()
        const response = httpContext.getResponse()
        const labels = LabeledRequestLogger.getRequestLabels(request, response)

        const logLevel = 'error'

        this.logRequestStart(request, labels, logLevel)
        this.logRequest(request, labels, logLevel)

        const exceptionLogger = new ExceptionLogger()
        exceptionLogger.logCriticalException(exception, labels, logLevel, false)

        this.logResponse(responseData, labels, logLevel)
        this.logResponseInfo(request, response, labels, logLevel)
        this.logRequestEnd(request, labels, logLevel)
    }

    private logRequest(request: ApiRequestData, labels: RequestLabels, type: RequestLogLevel): void {
        const { originalUrl, method, hostname, apiClient, ip, logData } = request

        ApplicationLogger.logDefault(type, originalUrl, labels, method.toUpperCase(), false)
        ApplicationLogger.logDefault(type, {
            url: logData ? logData.rawUrl : null,
            hostname,
            ip: apiClient ? apiClient.ip : ip,
            method,
        }, labels, 'Request info', false)


        if (apiClient) {
            const logData = this.getApiClientLogData(apiClient)
            ApplicationLogger.logDefault(type, logData, labels, 'Api client', false)
        }
        if (this.isQueryExists(request)) {
            ApplicationLogger.logDefault(type, request.query, labels, 'Query', false)
        }
        if (this.isRequestBodyExists(request)) {
            ApplicationLogger.logDefault(type, request.logData.logBody as Record<string, any>, labels, 'Body', false)
        }
    }

    private logResponse(responseData: Record<string, any>, labels: RequestLabels, type: RequestLogLevel): void {
        const responseLog = this.getResponseBodyLogData(responseData)
        ApplicationLogger.logDefault(type, responseLog as Record<string, any>, labels, 'Response', false)
    }

    private logResponseInfo(request: ApiRequestData, response: Record<string, any>, labels: RequestLabels, type: RequestLogLevel): void {
        const executionTime = this.getRequestExecutionTime(request)

        const { statusCode } = response

        ApplicationLogger.logDefault(type, { statusCode, executionTime }, labels, 'Response info', false)
    }

    private logRequestStart(request: ApiRequestData, labels: RequestLabels, type: RequestLogLevel): void {
        ApplicationLogger.logDefault(type, this.getAcceptedMessage(request), {
            ...labels,
            requestLogFlag: 'start',
        }, 'Request accepted')
    }

    private logRequestEnd(request: ApiRequestData, labels: RequestLabels, type: RequestLogLevel): void {
        ApplicationLogger.logDefault(type, this.getCompetedMessage(request), {
            ...labels,
            requestLogFlag: 'end',
        }, 'Request completed', false)
    }

    private static getRequestLabels(request: ApiRequestData, response: Record<string, any>): RequestLabels {
        const labels: RequestLabels = {
            method: request.method,
            status: response.statusCode,
            logType: LogMessageType.Request,
        }
        if (request.logData && request.logData.rawUrl) {
            labels.url = request.logData.rawUrl
        }
        return labels
    }
}
