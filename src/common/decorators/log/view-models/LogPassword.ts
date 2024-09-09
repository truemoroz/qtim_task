import { applyDecorators } from '@nestjs/common'
import { LogView } from './LogView'

export const LogPassword: () => PropertyDecorator = () => applyDecorators(
    LogView(object => '*'.repeat(object.length)),
)
