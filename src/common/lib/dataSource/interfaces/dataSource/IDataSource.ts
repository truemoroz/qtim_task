export interface IDataSource<TModel, TContext> {
    getEmptyContext(): Promise<TContext>

    getAll(context: TContext): Promise<TModel[]>

    getAllPaginated(context: TContext, limit: number, offset: number): Promise<TModel[]>

    countAll(context: TContext): Promise<number>

    getOne(context: TContext): Promise<TModel>
}
