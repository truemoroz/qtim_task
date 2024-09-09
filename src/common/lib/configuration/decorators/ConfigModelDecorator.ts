import { applyDecorators } from '@nestjs/common'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

export const CONFIG_MODEL_META = 'config_model_meta'

export const ConfigModel: (path: string) => ClassDecorator = (name: string) => applyDecorators(
    (target: Constructor<any>) => {
        Reflect.defineMetadata(CONFIG_MODEL_META, name, target)
        ConfigLoader.addConfigModel(target)
    },
)
