import { AuthExceptionsNS } from '@/common/exceptions/apiExceptions/namespaces'
import { ApiException } from '@/common/exceptions/ApiException'
import { IApiException } from '@/common/exceptions/apiExceptions/interfaces/IApiException'
import { AuthExceptionCodes } from '@/common/exceptions/apiExceptions/enums'

export class TokenInvalidException extends ApiException implements IApiException {
    readonly code = AuthExceptionCodes.TokenInvalid
    readonly errorName = 'tokenIsInvalid'
    readonly ns = AuthExceptionsNS
}
