import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { RequestLogHelper } from '@/common/lib/log/RequestLogHelper'
import { ResponseModel } from '@/common/models/responses/ResponseModel'
import { LabeledRequestLogger } from '@/common/lib/log/loggers/LabeledRequestLogger'

export const LoggerInterceptorIgnore = Symbol('LoggerInterceptorIgnore')

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const isIgnored = (context.getHandler() as unknown as { [key: symbol]: boolean })[LoggerInterceptorIgnore]
        if (isIgnored) {
            return next.handle()
        }

        RequestLogHelper.fillRequestData(context)

        return next.handle().pipe(
            tap((data: ResponseModel<any, any>) => {
                    const logger = new LabeledRequestLogger()
                    logger.logSuccessResponse(context, data)
                },
            ),
        )
    }
}
