import { applyDecorators } from '@nestjs/common'
import { ApiQuery } from '@nestjs/swagger'
import { ApiParamOptions } from '@nestjs/swagger/dist/decorators/api-param.decorator'

export const ApiImplicitQueryParams = (array: ApiParamOptions[] = []): MethodDecorator => {
    const decorators = array.map(p => ApiQuery(p))
    return applyDecorators(...decorators)
}
