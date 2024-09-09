import { IExceptionNS } from '@/common/exceptions/interfaces/IExceptionNS'
import { ExceptionCodeSpaces } from '@/common/exceptions/apiExceptions/enums'

export class DbExceptionsNS implements IExceptionNS {
    readonly namespace: string[] = ['exceptions', 'db']
    codeSpace = ExceptionCodeSpaces.Db
}
