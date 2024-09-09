import { IsInt } from 'class-validator'
import { DBModelQuery } from '@/common/lib/queryBuilder/DBModelQuery'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'
import { PaginationPayload } from '@/common/models/responses/PaginationResponse'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'

export class PaginationRequest {

    @IsInt()
    @FieldDescriptor({
        example: 10,
        type: () => Number,
        minimum: 1,
        maximum: 500,
    })
    readonly limit: number = 10

    @IsInt()
    @FieldDescriptor({
        example: 0,
        type: () => Number,
        minimum: 0,
    })
    readonly page: number = 0

    static getOffset(data: PaginationRequest): number {
        return data.page * data.limit
    }

    async paginate<T extends QueryableModel>(query: DBModelQuery<T>): Promise<PaginationPayload<T>> {
        const total = await query.count()
        const list = await query.limit(this.limit).offset(this.page * this.limit).getAll()
        return new PaginationPayload<T>(list, total)
    }

    get paginationOffset(): number {
        return this.page * this.limit
    }
}
