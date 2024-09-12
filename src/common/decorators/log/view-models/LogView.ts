import { applyDecorators } from '@nestjs/common'
import { LogAction } from '@/common/decorators/log/view-models/types/LogAction'


export const LogView: (action: LogAction) => PropertyDecorator = (action) => applyDecorators(
    ((object: Record<string, any> | Array<any>, propertyName: string) => {
        Reflect.defineMetadata(
            `${object.constructor.name}.${propertyName}`,
            action,
            object,
        )
    }),
)
