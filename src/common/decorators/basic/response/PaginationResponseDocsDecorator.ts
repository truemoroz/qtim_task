import { applyDecorators } from '@nestjs/common'
import { LogArray } from '@/common/decorators/log/view-models/LogArray'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { createPropertyDecorator } from '@nestjs/swagger/dist/decorators/helpers'
import { SuccessResponsePayloadDocs } from '@/common/decorators/basic/response/SuccessResponsePayloadDocDecorator'
import { ResponseParamType } from '@/common/decorators/basic/ApiMethodDocsDecorator'

export const PaginationResponseDocs = (payloadType: ResponseParamType, listItemType: ResponseParamType): ClassDecorator => {
    return applyDecorators(
        SuccessResponsePayloadDocs(payloadType),
        () => {
            LogArray(0, 0)(payloadType.prototype, 'list')
            createPropertyDecorator(DECORATORS.API_MODEL_PROPERTIES, {
                type: listItemType,
                isArray: true,
            }, true)(payloadType.prototype, 'list')
        },
    )
}
