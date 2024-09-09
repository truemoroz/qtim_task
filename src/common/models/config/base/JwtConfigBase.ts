import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator'
import { Type } from 'class-transformer'

export class JwtConfigBase {
    @IsString()
    @IsNotEmpty()
    secret: string

    @Type(() => Number)
    @IsNumber()
    @Min(1)
    expirationTime: number
}
