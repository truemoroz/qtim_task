import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { TransformToBoolean } from '@/common/decorators/validation/transform/TransformToBoolean'
import { ConfigModel } from '@/common/lib/configuration/decorators/ConfigModelDecorator'

@ConfigModel('application')
export class ApplicationConfig {
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(65536)
    port: number

    @IsNumber()
    @Type(() => Number)
    throttleLimit = 10

    @IsNumber()
    @Type(() => Number)
    throttleTtl = 60

    @IsBoolean()
    @TransformToBoolean()
    demoMode = false

    @IsString()
    @Type(() => String)
    @IsOptional()
    defaultApiVersion = '1'

    @IsString()
    @IsOptional()
    standName = 'local'

    @IsString()
    @IsOptional()
    remoteAuthSecretKey: string

    @IsUrl()
    host: string
}
