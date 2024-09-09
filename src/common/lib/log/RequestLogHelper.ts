import { ExecutionContext } from '@nestjs/common'
import { DataLogType, Log } from '@/common/lib/log/Log'
import { PARAMTYPES_METADATA, PATH_METADATA, ROUTE_ARGS_METADATA } from '@nestjs/common/constants'
import { RouteParamtypes } from '@nestjs/common/enums/route-paramtypes.enum'
import { plainToInstance } from 'class-transformer'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'
import { DateTime } from 'ts-luxon'
import { Uuid } from '@/common/lib/uuid/Uuid'

export class RequestLogHelper {
    public static createRequestBodyLog(context: ExecutionContext): DataLogType {
        const request = context.switchToHttp().getRequest<ApiRequestData>()
        const handler = context.getHandler()
        const controller = context.getClass()

        const routeArgs: Record<string, any> = Reflect.getMetadata(ROUTE_ARGS_METADATA, controller, handler.name)

        let bodyArgIndex = -1
        if (routeArgs) {
            const keys = Object.keys(routeArgs)
            for (let i = 0; i < keys.length; i++) {
                const type = parseInt(keys[i].split(':')[0])
                if (type == RouteParamtypes.BODY) {
                    bodyArgIndex = routeArgs[keys[i]].index
                }
            }
        }

        if (bodyArgIndex > -1) {
            const instance = new controller()
            const paramTypes = Reflect.getMetadata(PARAMTYPES_METADATA, instance, handler.name)

            const bodyParamType = paramTypes[bodyArgIndex]

            if (bodyParamType) {
                return Log.GetLog(plainToInstance(bodyParamType, request.body))
            }
        }

        return Log.GetLog(request.body)
    }

    public static getRawUrl(context: ExecutionContext): string {
        const handler = context.getHandler()
        const controller = context.getClass()

        let controllerPath: string = Reflect.getMetadata(PATH_METADATA, controller)
        let handlerPath: string = Reflect.getMetadata(PATH_METADATA, handler)
        if (controllerPath.endsWith('/')) {
            controllerPath.slice(controllerPath.length - 1)
        }

        if (!controllerPath.startsWith('/')) {
            controllerPath = '/' + controllerPath
        }

        if (handlerPath.startsWith('/')) {
            handlerPath = handlerPath.slice(1)
        }

        return `${controllerPath}/${handlerPath}`
    }

    public static fillRequestData(context: ExecutionContext): void {
        const http = context.switchToHttp()

        const request = http.getRequest<ApiRequestData>()
        request.guid = request.guid ||  Uuid.v4()
        if (!request.logData) {
            request.logData = {
                requestAcceptTime: DateTime.now(),
                logBody: RequestLogHelper.createRequestBodyLog(context),
                rawUrl: RequestLogHelper.getRawUrl(context),
            }
        }

        const response = http.getResponse()
        response.setHeader('x-api-request-id', request.guid)
    }
}
