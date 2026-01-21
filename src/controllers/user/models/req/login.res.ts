import { SuccessResponse } from '@/common/models/responses/SuccessResponse'
import { LogLimitLength } from '@/common/decorators/log/view-models/LogLimitLength'
import { SuccessResponsePayloadDocs } from '@/common/decorators/basic/response/SuccessResponsePayloadDocDecorator'
import { FieldDescriptor } from '@/common/decorators/models/FieldDescriptor'
import { JwtTokens } from '@/services/jwt/jwt-auth.service'

class LoginPayload {

    @FieldDescriptor({ example: '{bearer token}' })
    @LogLimitLength(40)
        accessToken: string

    @FieldDescriptor({ example: '{refresh token}' })
    @LogLimitLength(40)
        refreshToken: string

    @FieldDescriptor({ example: '{remote auth key}' })
    @LogLimitLength(5)
        remoteAuthKey: string

    constructor(tokens: JwtTokens, remoteAuthKey: string) {
        this.accessToken = tokens.access
        this.refreshToken = tokens.refresh
        this.remoteAuthKey = remoteAuthKey
    }
}

@SuccessResponsePayloadDocs(LoginPayload)
export class LoginRes extends SuccessResponse<LoginPayload> {
    constructor(tokens: JwtTokens, remoteAuthKey?: string) {
        super()
        this.payload = new LoginPayload(tokens, remoteAuthKey)
    }
}
