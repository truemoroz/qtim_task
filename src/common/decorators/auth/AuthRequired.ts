import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthGuard } from '@/common/guards/auth.guard'

/**
 * Делает метод доступным только для авторизованных пользователей
 * @constructor
 */
export const AuthRequired: () => PropertyDecorator = () => applyDecorators(
    ApiBearerAuth(),
    UseGuards(AuthGuard),

)
