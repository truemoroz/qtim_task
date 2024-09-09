import { ConfigModel } from '@/common/lib/configuration/decorators/ConfigModelDecorator'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { TransformToBoolean } from '@/common/decorators/validation/transform/TransformToBoolean'

@ConfigModel('telemetry')
export class TelemetryConfig {
    @IsBoolean()
    @IsOptional()
    @TransformToBoolean()
    enable: boolean

    @IsString()
    @IsOptional()
    traceEndpoint: string

    @IsString()
    @IsOptional()
    metricsEndpoint: string

    @IsString()
    @IsOptional()
    serviceName: string

    @IsString()
    @IsOptional()
    serviceNamespace: string
}
