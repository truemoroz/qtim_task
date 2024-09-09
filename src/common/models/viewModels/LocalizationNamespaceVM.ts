import { ViewModel } from '@/services/view-model/decorators/ViewModel'
import { LocalizationNamespace } from '@/common/models/database/LocalizationNamespace'
import { LTreeType } from '@/common/lib/sequelize/dataTypes/LTree'
import { VMProperty } from '@/services/view-model/decorators/VMProperty'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'
import { LocalizationMessageVM } from '@/common/models/viewModels/LocalizationMessageVM'

@ViewModel(LocalizationNamespace)
export class LocalizationNamespaceVM {
    @VMProperty()
    @FieldDescriptor({ example: 1 })
    id: number

    @VMProperty()
    @FieldDescriptor({ example: 'platform.planProperty.PV.title' })
    namespace: LTreeType

    @VMProperty(null, LocalizationMessageVM)
    @FieldDescriptor({ isArray: true })
    messages: LocalizationMessageVM[]
}
