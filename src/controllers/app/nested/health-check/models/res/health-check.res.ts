import { SuccessResponse } from '@/common/models/responses/SuccessResponse'
import { SuccessResponsePayloadDocs } from '@/common/decorators/basic/response/SuccessResponsePayloadDocDecorator'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class HealthCheck {
    @FieldDescriptor({ example: 'ok' })
    status: string

    @FieldDescriptor({ example: 14.6868227 })
    uptime: number

    @FieldDescriptor({ example: 1626257063082 })
    timestamp: number
}

@SuccessResponsePayloadDocs(HealthCheck)
export class HealthCheckRes extends SuccessResponse<HealthCheck> {
}
