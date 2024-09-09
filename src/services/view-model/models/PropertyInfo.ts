import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { IViewModelSelector } from '@/services/view-model/interfaces/IViewModelSelector'
import { IViewModelPropertyHandler } from '@/services/view-model/interfaces/IViewModelPropertyHandler'

/**
 * Описывает параметры свойства VM
 */
export interface PropertyInfo {
    /**
     * Имя свойства в исходном объекте
     */
    sourceName: string

    /**
     * Путь к стартовой модели
     */
    initialSourceKey?: string

    /**
     * Ключ свойства в исходном объекте
     */
    key: string

    /**
     * Имя свойства в результирующем объекте
     */
    destinationName: string

    /**
     * Селектор поля в исходной модели
     */
    selector: Constructor<IViewModelSelector>

    selectorInstance?: IViewModelSelector

    /**
     * Тип данных вложенного свойства
     */
    nestedType?: Constructor<any>

    /**
     * Кастомный обработчик преобразования
     */
    customHandler?: Constructor<IViewModelPropertyHandler<any>>

    handlerInstance?: IViewModelPropertyHandler<any>
}
