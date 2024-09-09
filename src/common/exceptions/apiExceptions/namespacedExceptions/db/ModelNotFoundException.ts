import { ApiException } from '@/common/exceptions/ApiException'
import { IApiException } from '@/common/exceptions/apiExceptions/interfaces/IApiException'
import { DbExceptionsNS } from '@/common/exceptions/apiExceptions/namespaces'
import { Model } from 'sequelize-typescript'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { DbExceptionCodes } from '@/common/exceptions/apiExceptions/enums'

export class ModelNotFoundException extends ApiException implements IApiException {
    readonly code = DbExceptionCodes.ModelNotFound
    readonly errorName = 'modelNotFound'
    readonly ns = DbExceptionsNS

    constructor(model: Constructor<Model>) {
        super()
        this.params = {
            modelName: model.name,
        }
    }
}
