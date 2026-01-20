import { Module } from '@nestjs/common'
import { ApiVersion } from '@/common/application/versioning/enum/ApiVersion'
import {
    ApiExceptionFilter, ValidationExceptionFilter,
    CriticalApiExceptionFilter, HttpExceptionFilter,
    InternalServerErrorExceptionFilter, UnhandledExceptionFilter,
} from '@/common/exceptionFilters'
import { LoggerInterceptor, ResponseMapInterceptor } from '@/common/interceptors'
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import path from 'path'
import { ModuleAutoloader } from '@/common/lib/moduleLoading/ModuleAutoloader'
import { TypeOrmModule } from '@nestjs/typeorm'
import dotenv from 'dotenv'

const exceptionFilters = [
    CriticalApiExceptionFilter,
    ValidationExceptionFilter,
    ApiExceptionFilter,
    InternalServerErrorExceptionFilter,
    HttpExceptionFilter,
    UnhandledExceptionFilter,
]
const interceptors = [
    LoggerInterceptor,
    ResponseMapInterceptor,
]

dotenv.config()
ConfigLoader.loadAll(process.env)

@Module({
    controllers: [],
    providers: [
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        ...exceptionFilters.reverse().map(p => ({
            provide: APP_FILTER,
            useClass: p,
        })),
        ...interceptors.map(p => ({
            provide: APP_INTERCEPTOR,
            useClass: p,
        })),
    ],

    imports: [
        CacheModule.register({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot(),
        ConfigModule.forRoot({
            load: [ConfigLoader.load(process.env)],
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [path.join(__dirname, '..', 'common', 'models', 'database', '**', '*.entity.{ts,js}')],
            synchronize: false,
            logging: true,
        }),
        // ServiceSequelizeModule.forRoot(),
        ...ModuleAutoloader.loadModules(path.join(__dirname, 'controllers')),
        ...ModuleAutoloader.loadModules(path.join(__dirname, 'services')),
    ],
})
export class AppModule {
    static readonly SERVICE_NAME = 'service_name'
    static readonly API_VERSION_DEFINITIONS: Record<ApiVersion, string> = {
        [ApiVersion.V1]: '1.0.0',
    }
}
