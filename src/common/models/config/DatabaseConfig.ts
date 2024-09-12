import { ConfigModel } from '@/common/lib/configuration/decorators/ConfigModelDecorator'
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'

@ConfigModel('database')
export class DatabaseConfig {
    @IsString()
    @IsNotEmpty()
    host: string

    @IsString()
    @IsOptional()
    replicaHost?: string

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(65536)
    port: number

    @IsString()
    @IsNotEmpty()
    user: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsString()
    @IsNotEmpty()
    database: string

    @IsNumber()
    @Min(1)
    maxPoolConnections = 30

    @IsNumber()
    @Min(0)
    minPoolConnections = 0

    @IsNumber()
    @Min(1)
    acquireTimeout = 60000
}
