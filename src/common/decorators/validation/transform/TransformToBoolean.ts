import { applyDecorators } from '@nestjs/common'
import { Transform } from 'class-transformer'

export const TransformToBoolean: () => PropertyDecorator = () => applyDecorators(
    Transform(obj => {
        if (obj.value === 'true') {
            return true
        }
        if (obj.value === 'false') {
            return false
        }
        return obj.value
    })
)
