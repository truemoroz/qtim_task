import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class UserCreateReq {
    @FieldDescriptor({
        example: 'demo@example.com',
        description: 'User email',
        required: true,
        minLength: 5,
        maxLength: 100,
    })
        email: string

    @FieldDescriptor({
        example: 'strongPassword123',
        description: 'User password',
        required: true,
        minLength: 8,
        maxLength: 100,
    })
        password: string
}
