import Transport from 'winston-transport'
import { LogMessagePayload } from '@/common/lib/log/models/LogMessagePayload'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { LogTransportType } from '@/common/lib/log/enum/LogTransportType'
import { LogLevelsConfig } from '@/common/models/config/LogLevelsConfig'
import { LogLevel } from '@/common/lib/log/enum/LogLevel'
import { LogMessageType } from '@/common/lib/log/enum/LogMessageType'

export abstract class LogTransportBase extends Transport {
    public static readonly LogLevels = Object.values(LogLevel)

    protected transportActive = true

    private readonly logLevelsConfig = ConfigLoader.getModelConfig(LogLevelsConfig)

    public abstract getTransportType(): LogTransportType

    protected abstract writeLog(info: LogMessagePayload): void

    log(info: LogMessagePayload, callback: () => void): void {
        setImmediate(() => {
            this.emit('logged', info)
        })
        if (this.transportActive) {
            const logType = LogTransportBase.getLogType(info)
            const logLevel = LogTransportBase.getLogLevelIndex(info.level)

            const transportConfig = this.getTransportConfig()
            const transportLogLevel = LogTransportBase.getLogLevelIndex(transportConfig[logType])

            if (logLevel <= transportLogLevel) {
                this.writeLog(info)
            }
        }
        callback()
    }

    private static getLogLevelIndex(logLevel: string): number {
        const currentLevelIndex = LogTransportBase.LogLevels.indexOf(logLevel as LogLevel)
        return currentLevelIndex > -1 ? currentLevelIndex : LogTransportBase.LogLevels.length + 1
    }

    private getTransportConfig(): Record<string, any> {
        const transportType = this.getTransportType()
        if (!this.logLevelsConfig[transportType]) {
            return LogTransportBase.getDefaultTransportConfig()
        }
        return this.logLevelsConfig[transportType]
    }

    private static getLogType(info: LogMessagePayload): LogMessageType {
        if (!info || !info.labels || !info.labels.logType) {
            return LogMessageType.Default
        }
        const availableLogTypes = Object.values(LogMessageType)
        if (availableLogTypes.indexOf(info.labels.logType) == -1) {
            return LogMessageType.Default
        }
        return info.labels.logType as LogMessageType
    }

    private static getDefaultTransportConfig(): Record<LogMessageType, LogLevel> {
        return {
            [LogMessageType.Default]: LogLevel.info,
            [LogMessageType.Request]: LogLevel.info,
            [LogMessageType.Sql]: LogLevel.info,
        }
    }
}
