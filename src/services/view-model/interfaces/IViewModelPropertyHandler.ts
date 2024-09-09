import { TVmPropertyContext } from '@/services/view-model/types/TVmPropertyContext'

export interface IViewModelPropertyHandler<T> {
    getValue(source: Record<string, any>, context: TVmPropertyContext): Promise<T>
}
