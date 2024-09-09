import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'

export const TransformToDate: () => PropertyDecorator = () => applyDecorators(
    Transform(obj => new Date(obj.value))
)
