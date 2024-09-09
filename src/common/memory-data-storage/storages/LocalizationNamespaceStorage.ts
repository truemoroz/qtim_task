import { DatabaseMemoryStorageBase } from '@/common/memory-data-storage/base/DatabaseMemoryStorageBase'
import { LocalizationNamespace } from '@/common/models/database/LocalizationNamespace'
import { DBModelQuery } from '@/common/lib/queryBuilder/DBModelQuery'
import { LocalizationMessage } from '@/common/models/database/LocalizationMessage'

export class LocalizationNamespaceStorage extends DatabaseMemoryStorageBase<LocalizationNamespace> {
    private static instance: LocalizationNamespaceStorage

    static getInstance(): LocalizationNamespaceStorage {
        if (!this.instance) {
            this.instance = new LocalizationNamespaceStorage()
        }
        return this.instance
    }

    async getQuery(): Promise<DBModelQuery<LocalizationNamespace>> {
        return LocalizationNamespace.query().include(LocalizationMessage)
    }
}
