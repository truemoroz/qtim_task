import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { PropertyInfo } from '@/services/view-model/models/PropertyInfo'
import { IViewModelHandler } from '@/services/view-model/interfaces/IViewModelHandler'

export type ModelHandlerType<T> = Constructor<IViewModelHandler<T>>

/**
 * Описывает параметры VM
 */
export class ViewModelData<TSource, TDestination> {
    constructor(modelType: Constructor<TSource>,
                viewModelType: Constructor<TDestination>,
                properties?: PropertyInfo[],
                modelHandler?: ModelHandlerType<TDestination>) {
        this.modelType = modelType
        this.viewModelType = viewModelType
        this.properties = properties
        this.modelHandler = modelHandler
    }

    /**
     * Тип исходной модели
     */
    modelType: Constructor<TSource>

    /**
     * Тип результирующей модели
     */
    viewModelType: Constructor<TDestination>

    /**
     * Список параметров свойств
     */
    properties: PropertyInfo[]

    /**
     * Произвольный обработчик модели
     */
    modelHandler: ModelHandlerType<TDestination>

    modelHandlerInstance: IViewModelHandler<TDestination>
}
