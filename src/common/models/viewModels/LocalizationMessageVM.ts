import { ViewModel } from '@/services/view-model/decorators/ViewModel'
import { LocalizationMessage } from '@/common/models/database/LocalizationMessage'
import { VMProperty } from '@/services/view-model/decorators/VMProperty'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

@ViewModel(LocalizationMessage)
export class LocalizationMessageVM {
    @VMProperty()
    @FieldDescriptor({
        example: 1,
        required: false,
    })
    id: string

    @VMProperty()
    @FieldDescriptor({
        example: 1,
    })
    namespace_id: number

    @VMProperty()
    @FieldDescriptor({
        example: 'en-US',
    })
    language: string

    @VMProperty()
    @FieldDescriptor({
        example: 'Personal volume',
    })
    message: string
}
