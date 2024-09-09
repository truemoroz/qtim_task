import { IMemoryDataStorage } from '@/common/memory-data-storage/interfaces/IMemoryDataStorage'
import { QueryableModel } from '@/common/lib/queryBuilder/models/QueryableModel'
import { DBModelQuery } from '@/common/lib/queryBuilder/DBModelQuery'
import { DateTime } from 'ts-luxon'

export abstract class DatabaseMemoryStorageBase<TModel extends QueryableModel> implements IMemoryDataStorage<TModel> {

    protected data: TModel[] = []

    private lastUpdate: DateTime
    private dataLoaded = false
    private dataLoading = false
    private dataLoadPromise: Promise<TModel[]>

    abstract getQuery(): Promise<DBModelQuery<TModel>>

    async forceUpdate(): Promise<void> {
        this.lastUpdate = DateTime.now()
        this.data = await (await this.getQuery()).getAll()
    }

    async getValues(): Promise<TModel[]> {
        if (!this.updateNeeded()) {
            return this.data
        }
        if (!this.dataLoading) {
            this.dataLoadPromise = this.loadData()
            this.dataLoading = true
        }
        this.data = await this.dataLoadPromise
        this.lastUpdate = DateTime.now()
        this.dataLoaded = true
        this.dataLoading = false
        return this.data
    }

    updateNeeded(): boolean {
        return !(this.data.length > 0 && this.dataLoaded && this.lastUpdate > DateTime.now().minus({ minutes: 1 }))
    }

    private async loadData(): Promise<TModel[]> {
        return (await this.getQuery()).getAll()
    }
}
