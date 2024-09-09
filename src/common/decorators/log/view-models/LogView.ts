import { applyDecorators } from '@nestjs/common'
import { DataLogType } from '@/common/lib/log/Log'

type LogAction = (object: Record<string, any> | string) => DataLogType

export const LogView: (action: LogAction) => PropertyDecorator = (action) => applyDecorators(
    ((object: Record<string, any> | Array<any>, propertyName: string) => {
        Reflect.defineMetadata(
            `${object.constructor.name}.${propertyName}`,
            action,
            object,
        )
    }),
)
