import { Logger } from '@nestjs/common'
import { LogMessageType } from '@/common/lib/log/enum/LogMessageType'

export class SqlLogger {
    public static logQuery(sql: string, time: number): void {
        Logger.log({
            message: sql,
            labels: { logType: LogMessageType.Sql },
        }, `SQL (${time} ms)`)
    }
}
