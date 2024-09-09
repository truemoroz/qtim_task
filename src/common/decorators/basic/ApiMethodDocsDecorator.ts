import { applyDecorators, HttpCode, Type } from '@nestjs/common'
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger'
import { BaseErrorResponse } from '@/common/models/responses/errorResponses/BaseErrorResponse'

export type ResponseParamType = Type<unknown> | Function

export const ApiMethodDocs = (summary: string, response: ResponseParamType, description = '', code = 200, deprecated = false): MethodDecorator => {
    return applyDecorators(
        ApiOperation({ summary, description, deprecated }),
        ApiOkResponse({ type: response }),
        ApiBadRequestResponse({ type: BaseErrorResponse }),
        HttpCode(code),
    )
}
