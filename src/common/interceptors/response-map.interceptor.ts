import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { map, Observable } from 'rxjs'
import { ResponseModel } from '@/common/models/responses/ResponseModel'
import { RawResponse } from '@/common/models/responses/RawResponse'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'

export class ResponseMapInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const http = context.switchToHttp()
        const request = http.getRequest<ApiRequestData>()
        return next.handle().pipe(
            map((data: ResponseModel<any, any>) => {
                if (data instanceof RawResponse) {
                    return data.rawString
                }

                data.requestId = request.guid
                return data
            }),
        )
    }
}
