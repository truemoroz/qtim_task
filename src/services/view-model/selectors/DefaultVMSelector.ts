import { IViewModelSelector } from '@/services/view-model/interfaces/IViewModelSelector'

export class DefaultVMSelector implements IViewModelSelector {
    async getProperty(sourceProperty: string, source: Record<string, any>): Promise<any> {
        return source[sourceProperty]
    }
}
