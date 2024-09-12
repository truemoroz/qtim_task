import { ConfigModel } from '@/common/lib/configuration/decorators/ConfigModelDecorator'
import { IsOptional, IsString } from 'class-validator'

@ConfigModel('alerts')
export class AlertsConfig {
    @IsOptional()
    @IsString()
    public url: string

    @IsOptional()
    @IsString()
    public token: string
}
