import { Injectable, OnModuleInit } from '@nestjs/common'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ModelHandlerType, ViewModelData } from '@/services/view-model/models/ViewModelData'
import { PropertyInfo } from '@/services/view-model/models/PropertyInfo'
import { ModuleRef } from '@nestjs/core'
import { IViewModelSelector } from '@/services/view-model/interfaces/IViewModelSelector'
import { IViewModelPropertyHandler } from '@/services/view-model/interfaces/IViewModelPropertyHandler'
import { IViewModelHandler } from '@/services/view-model/interfaces/IViewModelHandler'
import { PathHelper } from '@/common/lib/path/PathHelper'
import { TMapArrayParams } from '@/services/view-model/types/TMapArrayParams'
import { TMapParams } from '@/services/view-model/types/TMapParams'

@Injectable()
export class ViewModelService implements OnModuleInit {
    private static viewModels: Record<string, ViewModelData<any, any>> = {}

    private static viewModelOptions: Record<string, Record<string, PropertyInfo>> = {}

    private propertySelectorInstances: { type: Constructor<any>, instance: IViewModelSelector }[] = []
    private propertyHandlerInstances: { type: Constructor<any>, instance: IViewModelPropertyHandler<any> }[] = []
    private modelHandlerInstances: { type: Constructor<any>, instance: IViewModelHandler<any> }[] = []

    constructor(
        private readonly moduleRef: ModuleRef,
    ) {
    }

    public static addViewModel<TSource, TDestination>(source: Constructor<TSource>, constructor: Constructor<TDestination>, modelHandler?: ModelHandlerType<TDestination>): void {
        if (!this.viewModels[constructor.name]) {
            const modelProperties = this.viewModelOptions[constructor.name] ? Object.values(this.viewModelOptions[constructor.name]) : []
            this.viewModels[constructor.name] = new ViewModelData<TSource, TDestination>(source, constructor, modelProperties, modelHandler)
        }
    }

    public static addVMProperty(viewModelName: string, propertyKey: string, propertyInfo: PropertyInfo): void {
        const vmOptions = this.getViewModelOptions(viewModelName)

        if (vmOptions[propertyKey]) {
            vmOptions[propertyKey] = { ...vmOptions[propertyKey], ...propertyInfo }
        } else {
            vmOptions[propertyKey] = propertyInfo
        }
    }

    public static setVMPropertyField<T extends PropertyInfo, TKey extends keyof PropertyInfo>(viewModelName: string, propertyKey: string, field: TKey, value: T[TKey]): void {
        const vmOptions = this.getViewModelOptions(viewModelName)

        if (vmOptions[propertyKey]) {
            vmOptions[propertyKey] = { ...vmOptions[propertyKey], [field]: value }
        } else {
            vmOptions[propertyKey] = { [field]: value } as any as PropertyInfo
        }
    }

    private static getViewModelOptions(viewModelName: string): Record<string, PropertyInfo> {
        if (!this.viewModelOptions[viewModelName]) {
            this.viewModelOptions[viewModelName] = {}
        }
        return this.viewModelOptions[viewModelName]
    }

    async onModuleInit(): Promise<void> {
        const vmKeys = Object.keys(ViewModelService.viewModels)
        for (let i = 0; i < vmKeys.length; i++) {
            const viewModel = ViewModelService.viewModels[vmKeys[i]]
            if (viewModel.modelHandler) {
                const existsHandler = this.modelHandlerInstances.find(p => p.type === viewModel.modelHandler)
                if (existsHandler) {
                    viewModel.modelHandlerInstance = existsHandler.instance
                } else {
                    viewModel.modelHandlerInstance = await this.moduleRef.create(viewModel.modelHandler)
                    this.modelHandlerInstances.push({
                        type: viewModel.modelHandler,
                        instance: viewModel.modelHandlerInstance,
                    })
                }
            }
            if (!viewModel.properties) {
                continue
            }
            for (let j = 0; j < viewModel.properties.length; j++) {
                const property = viewModel.properties[j]
                const existsSelector = this.propertySelectorInstances.find(p => p.type === property.selector)
                if (existsSelector) {
                    property.selectorInstance = existsSelector.instance
                } else {
                    property.selectorInstance = await this.moduleRef.create(property.selector)
                    this.propertySelectorInstances.push({
                        type: property.selector,
                        instance: property.selectorInstance,
                    })
                }
                if (property.customHandler) {
                    const existsHandler = this.propertyHandlerInstances.find(p => p.type === property.customHandler)
                    if (existsHandler) {
                        property.handlerInstance = existsHandler.instance
                    } else {
                        property.handlerInstance = await this.moduleRef.create(property.customHandler)
                        this.propertyHandlerInstances.push({
                            type: property.customHandler,
                            instance: property.handlerInstance,
                        })
                    }
                }
            }
        }
    }

    /**
     * Выполняет преобразование единичной модели
     * @param source Исходная модель
     * @param destinationType Тип результирующей модели
     * @param client Модель клиента
     * @param ignoreBaseModelHandler Игнорировать базовый обработчик модели
     */
    // async map<T extends Record<string, any>>({ source, destinationType, client, ignoreBaseModelHandler = false }: TMapParams<T>): Promise<T> {
    async map<T extends Record<string, any>>({ source, destinationType, ignoreBaseModelHandler = false }: TMapParams<T>): Promise<T> {
        const typeName: string = destinationType.name
        if (!ViewModelService.viewModels[typeName]) {
            throw new Error('View model ' + typeName + ' not found')
        }
        const vm: ViewModelData<any, any> = ViewModelService.viewModels[typeName]
        const properties: PropertyInfo[] = vm.properties
        let result: T = new destinationType()
        if (vm.modelHandlerInstance && !ignoreBaseModelHandler) {
            const handlerResult = await vm.modelHandlerInstance.getValue(source, {
                sourceName: null,
                modelProperties: properties,
                // client,
            })
            if (handlerResult !== undefined) {
                result = handlerResult
            }
            return result
        }
        for (let i = 0; i < properties.length; i++) {
            const { nestedType, sourceName, destinationName, initialSourceKey } = properties[i]
            const initialSource = initialSourceKey ? PathHelper.resolvePath(initialSourceKey, source) : source
            let property = await properties[i].selectorInstance.getProperty(sourceName, initialSource)
            if (nestedType && ViewModelService.viewModels[nestedType.name] && ViewModelService.viewModels[nestedType.name].modelHandlerInstance) {
                const handlerResult = await ViewModelService.viewModels[nestedType.name].modelHandlerInstance.getValue(initialSource, {
                    sourceName,
                    modelProperties: properties,
                    // client,
                })
                if (handlerResult !== undefined) {
                    (result as Record<string, any>)[destinationName] = handlerResult
                }
                continue
            }
            if (nestedType && ViewModelService.viewModels[nestedType.name] && property) {
                if (Array.isArray(property)) {
                    (result as Record<string, any>)[destinationName] = await this.mapArray({
                        source: property,
                        destinationType: nestedType,
                        // client: client,
                    })
                } else {
                    (result as Record<string, any>)[destinationName] = await this.map({
                        source: property,
                        destinationType: nestedType,
                        // client: client,
                    })
                }
            } else {
                if (properties[i].customHandler) {
                    property = await properties[i].handlerInstance.getValue(initialSource, {
                        sourceName,
                        destinationName,
                        propertyValue: property,
                        // client,
                    })
                }
                if (property === undefined) {
                    continue
                }
                (result as Record<string, any>)[destinationName] = property
            }
        }
        return result
    }

    /**
     * Выполняет преобразование массива моделей
     * @param source Массив исходным моделей
     * @param destinationType Тип, в который необходимо преобразовать модели
     * @param client Модель клиента
     * @param ignoreBaseModelHandler Игнорировать базовый обработчик модели
     */
    // async mapArray<T>({ source, destinationType, client, ignoreBaseModelHandler = false }: TMapArrayParams<T>): Promise<T[]> {
    async mapArray<T>({ source, destinationType, ignoreBaseModelHandler = false }: TMapArrayParams<T>): Promise<T[]> {
        const result: T[] = []
        for (let i = 0; i < source.length; i++) {
            result.push(await this.map({
                source: source[i],
                destinationType: destinationType,
                // client: client,
                ignoreBaseModelHandler: ignoreBaseModelHandler,
            }))
        }
        return result
    }
}
