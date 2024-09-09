import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { applyDecorators, DynamicModule, ForwardReference, Module, Provider, Type } from '@nestjs/common'
import { Abstract } from '@nestjs/common/interfaces/abstract.interface'
import { ModuleAutoloader } from '@/common/lib/moduleLoading/ModuleAutoloader'

type ImportsType = Array<Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference>

type AdditionalExportsType = Array<DynamicModule | Promise<DynamicModule> | string | symbol | Provider | ForwardReference | Abstract<any> | Function>

export const ControllerModule = (controller: Constructor<any>, imports?: ImportsType, providers: Provider[] = [], additionalExports: AdditionalExportsType = []): ClassDecorator => {
    return applyDecorators(
        Module({
            controllers: [controller],
            providers,
            imports,
            exports: [...additionalExports],
        }),
        (target: Function) => {
            ModuleAutoloader.addModule(target)
        },
    )
}
