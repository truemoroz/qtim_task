import { applyDecorators } from '@nestjs/common'
import { ApiParam } from '@nestjs/swagger'
import { ApiParamOptions } from '@nestjs/swagger/dist/decorators/api-param.decorator'


export const ApiImplicitParams = (array: ApiParamOptions[] = []): MethodDecorator => {
    const decorators = array.map(p => ApiParam(p))
    return applyDecorators(...decorators)
}
