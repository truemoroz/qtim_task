import { JwtConfigBase } from '@/common/models/config/base/JwtConfigBase'

export interface IJwt<T extends Record<string, any>> {
    readonly config: JwtConfigBase
    payload: T
}
