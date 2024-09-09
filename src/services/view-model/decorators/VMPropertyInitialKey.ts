import { ViewModelService } from '@/services/view-model/view-model.service'

export function VMPropertyInitialKey(key: string): PropertyDecorator {
    return function(object: Record<string, any>, propertyName: string): void {
        ViewModelService.setVMPropertyField(object.constructor.name, propertyName, 'initialSourceKey', key)
    }
}
