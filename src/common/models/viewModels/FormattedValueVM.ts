import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class FormattedValueVM {
    @FieldDescriptor({ example: 'user@example.com', description: 'Raw value' })
    raw: string | number | Record<string, any> | null

    @FieldDescriptor({ example: 'user@example.com', description: 'Display value' })
    presentable: string
}
