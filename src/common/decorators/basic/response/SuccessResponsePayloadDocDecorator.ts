import { applyDecorators } from '@nestjs/common'
import { DECORATORS } from '@nestjs/swagger/dist/constants'
import { createPropertyDecorator } from '@nestjs/swagger/dist/decorators/helpers'
import { ResponseParamType } from '@/common/decorators/basic/ApiMethodDocsDecorator'
import { LogArray } from '@/common/decorators/log/view-models/LogArray'

export const SuccessResponsePayloadDocs = (payloadType: ResponseParamType, isArray = false): ClassDecorator => {
    return applyDecorators(
        target => {
            createPropertyDecorator(DECORATORS.API_MODEL_PROPERTIES, {
                type: payloadType,
                isArray,
            }, true)(target.prototype, 'payload')
        },
        target => {
            if (isArray) {
                LogArray(1)(target.prototype, 'payload')
            }
        },
    )
}
