import { IsInt, IsNumber, IsOptional, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class ArticlePaginationReq {
    @FieldDescriptor({ required: false, default: 1 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
        page: number = 1

    @FieldDescriptor({ required: false, default: 10 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Type(() => Number)
        limit: number = 10

    @FieldDescriptor({ required: false })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
        authorId?: number

    @FieldDescriptor({ required: false, dateValue: true })
    @IsOptional()
        publishDate?: Date
}
