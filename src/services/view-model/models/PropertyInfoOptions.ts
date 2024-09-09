import { IViewModelSelector } from '@/services/view-model/interfaces/IViewModelSelector'
import { IViewModelPropertyHandler } from '@/services/view-model/interfaces/IViewModelPropertyHandler'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

/**
 * Опции полей View Models
 */
export interface PropertyInfoOptions {

    /**
     * Должна возвращать значение поля на основе переданных параметров
     */
    customHandler?: Constructor<IViewModelPropertyHandler<any>>

    /**
     * Должна возвращать объект, над которым будут произведены преобразования
     */
    customSelector?: Constructor<IViewModelSelector>
}
