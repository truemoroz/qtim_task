import { INestApplication, Logger, Type } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { getGlobalPrefix } from '@nestjs/swagger/dist/utils/get-global-prefix'
import { ModulesContainer, NestContainer } from '@nestjs/core'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { ApplicationConfig } from '@/common/models/config'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ApiVersion } from '@/common/application/versioning/enum/ApiVersion'

const applicationConfig = ConfigLoader.getModelConfig(ApplicationConfig)

export class DocumentationLoader {
    public static readonly DefaultApiTitle = 'MLM Soft Service'
    public static readonly DefaultApiDescription =
        'MLM Soft Service documentation'
    public static readonly DefaultApiDefinitionPrefix = 'API Version '

    private static versionedControllers: Record<string, Constructor<any>[]> = {}
    private static neutralControllers: Constructor<any>[] = []

    public static addVersionedController(
        version: ApiVersion,
        controller: Constructor<any>,
    ): void {
        if (!this.versionedControllers[version]) {
            this.versionedControllers[version] = []
        }
        this.versionedControllers[version].push(controller)
    }

    public static addNeutralController(controller: Constructor<any>): void {
        this.neutralControllers.push(controller)
    }

    public static load(app: INestApplication): void {
        Logger.log('Start loading docs', DocumentationLoader.name)
        const globalPrefix = getGlobalPrefix(app)
        const defaultVersion = applicationConfig.defaultApiVersion

        const container = (app as any).container as NestContainer
        const modules = container.getModules()

        const config = new DocumentBuilder()
            .setTitle(this.DefaultApiTitle)
            .setDescription(this.DefaultApiDescription)
            .setVersion('1')
            .addBearerAuth()
            .build()

        const includes = DocumentationLoader.findModulesForControllers(modules, this.neutralControllers)
        const document = SwaggerModule.createDocument(app, config, { include: includes })
        const paths = Object.keys(document.paths).filter((p) =>
            p.startsWith(`/v${defaultVersion}/`),
        )
        for (let j = 0; j < paths.length; j++) {
            delete document.paths[paths[j]]
        }

        const url = `${globalPrefix}/v${defaultVersion}/api/docs`

        Logger.log(
            `Load version ${defaultVersion} successful. URL: ${url}.json`,
            DocumentationLoader.name,
        )

        SwaggerModule.setup(`${globalPrefix}/api/docs`, app, document, {
            swaggerUrl: url,
            include: [],
            swaggerOptions: {
                tagsSorter: (a: string, b: string) => a > b,
                defaultModelsExpandDepth: 0,
            },
        } as any)

        Logger.log(
            `Load docs successful. base URL: ${globalPrefix}/api/docs`,
            DocumentationLoader.name,
        )
    }

    private static findModulesForControllers(
        modules: ModulesContainer,
        controllers: any,
    ): Type[] {
        const result: Type[] = []
        for (let i = 0; i < controllers.length; i++) {
            const currentController = controllers[i]
            const currentModules = [...modules.values()].filter(
                (p) =>
                    [...p.controllers.values()].findIndex(
                        (c) => c.metatype == currentController,
                    ) > -1,
            )
            result.push(...currentModules.map((p) => p.metatype))
        }
        return result
    }
}
