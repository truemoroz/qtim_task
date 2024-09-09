import { TVmContext } from '@/services/view-model/types/TVmContext'

export interface IViewModelHandler<T> {
    getValue(source: Record<string, any>, context: TVmContext): Promise<T>
}
