import { ApiException } from '@/common/exceptions/ApiException'
import { CriticalLevel } from '@/common/exceptions/enum/CriticalLevel'
import { HttpStatus } from '@nestjs/common'

export class CriticalApiException extends ApiException {
    public criticalLevel = CriticalLevel.High

    constructor(baseException?: Error) {
        super(baseException, HttpStatus.INTERNAL_SERVER_ERROR)
    }
}
