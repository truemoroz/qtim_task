import { DateTime } from 'ts-luxon'
import { DataLogType } from '@/common/lib/log/Log'

export class LogData {
    requestAcceptTime: DateTime
    logBody: DataLogType
    rawUrl: string
}
