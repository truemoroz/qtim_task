import { IExceptionNS } from '@/common/exceptions/interfaces/IExceptionNS'
import { ExceptionCodeSpaces } from '@/common/exceptions/apiExceptions/enums'

export class AuthExceptionsNS implements IExceptionNS {
    readonly namespace: string[] = ['exceptions', 'auth']
    codeSpace = ExceptionCodeSpaces.Auth
}
