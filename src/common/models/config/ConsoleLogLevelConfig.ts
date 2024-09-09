import { IsEnum } from 'class-validator'
import { LogLevel } from '@/common/lib/log/enum/LogLevel'

export class ConsoleLogLevelConfig {
    @IsEnum(LogLevel)
    default = LogLevel.info

    @IsEnum(LogLevel)
    request = LogLevel.info

    @IsEnum(LogLevel)
    sql = LogLevel.none
}
