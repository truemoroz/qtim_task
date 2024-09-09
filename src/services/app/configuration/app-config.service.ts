import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { plainToInstance } from 'class-transformer'
import { CONFIG_MODEL_META } from '@/common/lib/configuration/decorators/ConfigModelDecorator'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'

@Injectable()
export class AppConfigService {
    constructor(private readonly configService: ConfigService) {
    }

    public get<T>(model: Constructor<T>): T {
        const configPath = Reflect.getMetadata(CONFIG_MODEL_META, model)
        const raw = this.configService.get<T>(configPath)
        if (raw) {
            return plainToInstance(model, raw, { exposeDefaultValues: true })
        }
        return null
    }

    public static getModel<T>(model: Constructor<T>): T {
        return ConfigLoader.getModelConfig(model)
    }
}
