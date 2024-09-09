import { IViewModelSelector } from '@/services/view-model/interfaces/IViewModelSelector'
import { PathHelper } from '@/common/lib/path/PathHelper'

export class SequelizeVMSelector implements IViewModelSelector {
    async getProperty(sourceProperty: string, source: Record<string, any>): Promise<any> {
        if (!source) {
            return undefined
        }
        const dataValues = source['dataValues'] ? source['dataValues'] : source
        if (sourceProperty.indexOf('.') > -1) {
            return PathHelper.resolvePath(sourceProperty, dataValues)
        }
        return dataValues[sourceProperty]
    }
}
