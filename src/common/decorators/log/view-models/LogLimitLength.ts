import { applyDecorators } from '@nestjs/common'
import { LogView } from './LogView'

export const LogLimitLength: (length: number) => PropertyDecorator = (length) => applyDecorators(
    LogView((object: string | Record<string, any>) => {
        if (typeof object === 'string') {
            return object.substring(0, length) + '...'
        }
        return object
    }),
)
