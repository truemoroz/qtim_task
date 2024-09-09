import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ViewModelService } from '@/services/view-model/view-model.service'
import { ModelHandlerType } from '@/services/view-model/models/ViewModelData'

/**
 * Обозначает принадлежность текущей модели к другой
 * @param source Тип исходной модели
 * @param modelHandler Произвольный обработчик модели
 * @constructor
 */
export const ViewModel = <TSource, TDestination>(source: Constructor<TSource>, modelHandler?: ModelHandlerType<TDestination | Array<TDestination>>) => {
    return function(constructor: Constructor<TDestination>): void {
        ViewModelService.addViewModel(source, constructor, modelHandler)
    }
}
