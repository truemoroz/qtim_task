import { ApiException } from '@/common/exceptions/ApiException'
import { IApiException } from '@/common/exceptions/apiExceptions/interfaces/IApiException'
import { DbExceptionsNS } from '@/common/exceptions/apiExceptions/namespaces'
import { Model } from 'sequelize-typescript'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { DbExceptionCodes } from '@/common/exceptions/apiExceptions/enums'

export class ModelAlreadyExistsException extends ApiException implements IApiException {
    readonly code = DbExceptionCodes.ModelAlreadyExists
    readonly errorName = 'modelAlreadyExists'
    readonly ns = DbExceptionsNS

    constructor(model: Constructor<Model>) {
        super()
        this.params = {
            modelName: model.name,
        }
    }
}
