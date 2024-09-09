import { applyDecorators, Controller, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { DocApiTag } from '@/common/docs/DocApiTag'
import { ControllerOptions } from '@nestjs/common/decorators/core/controller.decorator'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { ApplicationConfig } from '@/common/models/config'
import { VersionValue } from '@nestjs/common/interfaces'
import { ApiVersion } from '@/common/application/versioning/enum/ApiVersion'
import { DocumentationLoader } from '@/common/docs/DocumentationLoader'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'

const applicationConfig = ConfigLoader.getModelConfig(ApplicationConfig)

export const ApiController = (path: string, tag: DocApiTag, version?: ApiVersion, options?: ControllerOptions): ClassDecorator => {
    let versionValue: VersionValue
    if (version) {
        versionValue = [version]
        if (applicationConfig.defaultApiVersion === version) {
            versionValue.push(VERSION_NEUTRAL)
        }
    }
    return applyDecorators(
        (target: Constructor<any>) => {
            if (version) {
                DocumentationLoader.addVersionedController(version, target)
            } else {
                DocumentationLoader.addNeutralController(target)
            }
        },
        ApiTags(tag),
        Controller({
            path,
            version: versionValue,
            ...options,
        }),
    )
}
