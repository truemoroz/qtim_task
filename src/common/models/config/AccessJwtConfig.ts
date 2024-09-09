import { JwtConfigBase } from '@/common/models/config/base/JwtConfigBase'
import { ConfigModel } from '@/common/lib/configuration/decorators/ConfigModelDecorator'

@ConfigModel('jwt.access')
export class AccessJwtConfig extends JwtConfigBase {
}
