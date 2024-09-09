import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'

export const TransformToLowerCase: () => PropertyDecorator = () => applyDecorators(
    Transform(obj => obj.value.toLowerCase().trim())
)
