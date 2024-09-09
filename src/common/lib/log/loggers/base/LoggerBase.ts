import { LogLabels } from '@/common/lib/log/models/LogLabels'
import { LogMessageType } from '@/common/lib/log/enum/LogMessageType'

export abstract class LoggerBase {
    constructor(private readonly context?: string) {
    }

    protected fillDefaultLabels(labels: LogLabels): LogLabels {
        if (!labels) {
            labels = {}
        }
        if (!labels.logType) {
            labels.logType = LogMessageType.Default
        }
        if (!labels.service) {
            labels.service = this.getContext()
        }
        return labels
    }

    protected getContext(userContext?: string): string {
        let resultContext = this.context
        if (!resultContext) {
            resultContext = userContext
        } else if (!!userContext) {
            resultContext += ' -> ' + userContext
        }
        if (!resultContext) {
            resultContext = LoggerBase.name
        }
        return resultContext
    }
}
