import { ConfigModel } from '@/common/lib/configuration/decorators/ConfigModelDecorator'
import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import { ConsoleLogLevelConfig } from '@/common/models/config/ConsoleLogLevelConfig'

@ConfigModel('logs.logLevels')
export class LogLevelsConfig {
    @Type(() => ConsoleLogLevelConfig)
    @ValidateNested()
    console: ConsoleLogLevelConfig
}
