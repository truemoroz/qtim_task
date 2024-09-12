import { JwtConfigBase } from '@/common/models/config/base/JwtConfigBase'
import { ConfigModel } from '@/common/lib/configuration/decorators/ConfigModelDecorator'

@ConfigModel('jwt.refresh')
export class RefreshJwtConfig extends JwtConfigBase {}
