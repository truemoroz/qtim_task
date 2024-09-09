import { Injectable } from '@nestjs/common'
import { LocalizationMessageVM } from '@/common/models/viewModels/LocalizationMessageVM'
import { LocalizationNamespace } from '@/common/models/database/LocalizationNamespace'
import { Language } from '@/common/models/database/Language'
import { ArrayHelper } from '@/common/lib/array/ArrayHelper'
import { LocalizationMessage, LocalizationMessageCA } from '@/common/models/database/LocalizationMessage'
import { ModelNotFoundException } from '@/common/exceptions/apiExceptions'


@Injectable()
export class LocalizationNamespaceService {
    public async updateMessages(messages: LocalizationMessageVM[]): Promise<void> {
        const languages = await Language.query().getAll()
        const languageMap = ArrayHelper.createMap(languages, 'id')

        const namespaces = await LocalizationNamespace.query()
            .where({
                id: messages.map(p => p.namespace_id),
            })
            .getAll()
        const namespaceMap = ArrayHelper.createMap(namespaces, 'id')

        const existsMessages = await LocalizationMessage.query()
            .where({
                id: messages.filter(p => !!p.id).map(p => p.id),
            })
            .getAll()
        const messageMap = ArrayHelper.createMap(existsMessages, 'id')

        const messagesToUpdate: LocalizationMessageCA[] = []

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i]
            if (!languageMap[message.language]) {
                throw new ModelNotFoundException(Language)
            }
            if (!namespaceMap[message.namespace_id]) {
                throw new ModelNotFoundException(LocalizationNamespace)
            }
            if (!message.id || !messageMap[message.id]) {
                messagesToUpdate.push({
                    namespace_id: message.namespace_id,
                    language: message.language,
                    message: message.message,
                })
            } else {
                const dbMessage = messageMap[message.id]
                dbMessage.message = message.message
                messagesToUpdate.push(dbMessage['dataValues'])
            }
        }
        await LocalizationMessage.bulkCreate(messagesToUpdate, {
            updateOnDuplicate: ['message'],
        })
    }
}
