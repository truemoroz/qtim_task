import { ApiResponseBase } from '@/common/models/responses/ApiResponseBase'

export class RawResponse extends ApiResponseBase {
    rawString: string

    constructor(rawString: string) {
        super()
        this.rawString = rawString
    }
}
