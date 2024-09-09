import { Injectable } from '@nestjs/common'
import { IViewModelPropertyHandler } from '@/services/view-model/interfaces/IViewModelPropertyHandler'
import { TVmPropertyContext } from '@/services/view-model/types/TVmPropertyContext'

@Injectable()
export class PositiveOnlyVmHandler implements IViewModelPropertyHandler<number | string> {
    async getValue(source: Record<string, any>, { propertyValue }: TVmPropertyContext): Promise<number | string> {
        const num = Number(propertyValue)
        if (!isNaN(num)) {
            return num < 0 ? 0 : num
        }
        return propertyValue
    }
}
