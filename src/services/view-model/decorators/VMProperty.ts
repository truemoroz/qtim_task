import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ViewModelService } from '@/services/view-model/view-model.service'
import { PropertyInfo } from '@/services/view-model/models/PropertyInfo'
import { SequelizeVMSelector } from '@/services/view-model/selectors/SequelizeVMSelector'
import { PropertyInfoOptions } from '@/services/view-model/models/PropertyInfoOptions'

/**
 * Обозначает свойства поля в VM
 * @param name Имя поля в исходной модели
 * @param nestedType Тип поля (при наличии вложенности)
 * @param options Дополнительные параметры
 * @constructor
 */
export function VMProperty(name?: string, nestedType?: Constructor<any> | (() => Constructor<any>), options?: PropertyInfoOptions): PropertyDecorator {
    return function(object: Record<string, any>, propertyName: string): void {
        const opt: PropertyInfo = {
            sourceName: name ?? propertyName,
            destinationName: propertyName,
            selector: SequelizeVMSelector,
            key: propertyName
        }
        if (nestedType) {
            opt.nestedType = !nestedType.name ? (nestedType as any)() : nestedType
        }
        if (options) {
            opt.customHandler = options.customHandler
            if (options.customSelector) {
                opt.selector = options.customSelector
            }
        }
        if (options && options.customHandler) {
            opt.customHandler = options.customHandler
        }
        ViewModelService.addVMProperty(object.constructor.name, propertyName, opt)
    }
}
