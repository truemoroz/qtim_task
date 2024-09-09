export interface IMemoryDataStorage<TModel> {
    getValues(): Promise<TModel[]>

    forceUpdate(): Promise<void>
}
