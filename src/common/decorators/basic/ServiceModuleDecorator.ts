import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { applyDecorators, DynamicModule, ForwardReference, Module, Provider, Type } from '@nestjs/common'
import { Abstract } from '@nestjs/common/interfaces/abstract.interface'

type ImportsType = Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference>

type AdditionalExportsType = Array<DynamicModule | Promise<DynamicModule> | string | symbol | Provider | ForwardReference | Abstract<any> | Function>

export const ServiceModule = (service: Constructor<any>, imports?: ImportsType, providers: Provider[] = [], additionalExports: AdditionalExportsType = []): ClassDecorator => {
    return applyDecorators(
        Module({
            providers: [service, ...providers],
            imports: imports,
            exports: [service, ...additionalExports],
        }),
    )
}
