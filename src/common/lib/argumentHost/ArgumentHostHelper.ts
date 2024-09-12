import { ArgumentsHost } from '@nestjs/common'
import { ApiRequestData } from '@/common/models/requests/basic/ApiRequestData'
import { Uuid } from '@/common/lib/uuid/Uuid'

export class ArgumentHostHelper {
    public static getApiRequestData(host: ArgumentsHost): ApiRequestData {
        const request = host.switchToHttp().getRequest<ApiRequestData>()
        if (!request.guid) {
            request.guid = Uuid.v4()
        }
        return request
    }
}
