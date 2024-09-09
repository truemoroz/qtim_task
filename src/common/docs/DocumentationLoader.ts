import { INestApplication, Logger, Type } from '@nestjs/common'
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger'
import { getGlobalPrefix } from '@nestjs/swagger/dist/utils/get-global-prefix'
import { ModulesContainer, NestContainer } from '@nestjs/core'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { ApplicationConfig } from '@/common/models/config'
import { AppModule } from '@/app.module'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { ApiVersion } from '@/common/application/versioning/enum/ApiVersion'

const applicationConfig = ConfigLoader.getModelConfig(ApplicationConfig)

export class DocumentationLoader {
    public static readonly DefaultApiTitle = 'MLM Soft API'
    public static readonly DefaultApiDescription = 'MLM Soft API documentation'
    public static readonly DefaultApiDefinitionPrefix = 'API Version '

    private static versionedControllers: Record<number, Constructor<any>[]> = {}
    private static neutralControllers: Constructor<any>[] = []

    public static addVersionedController(version: ApiVersion, controller: Constructor<any>): void {
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
        const globalPrefix = '/' + getGlobalPrefix(app)
        const defaultVersion = applicationConfig.defaultApiVersion

        const container = (app as any).container as NestContainer
        const modules = container.getModules()
        const versions = Object.keys(AppModule.API_VERSION_DEFINITIONS) as ApiVersion[]

        const urls: { url: string, name: string }[] = []

        for (let i = 0; i < versions.length; i++) {
            const v = versions[i]
            const includes = [...DocumentationLoader.findModulesForControllers(modules, this.versionedControllers[v])]
            const config = new DocumentBuilder()
                .setTitle(this.DefaultApiTitle)
                .setDescription(this.DefaultApiDescription)
                .setVersion(AppModule.API_VERSION_DEFINITIONS[v] + ((v == applicationConfig.defaultApiVersion) ? ' (default)' : ''))
                .addBearerAuth()
                .build()

            includes.push(...DocumentationLoader.findModulesForControllers(modules, this.neutralControllers))

            const document = SwaggerModule.createDocument(app, config, {
                include: includes,
            })
            if (v === defaultVersion) {
                const paths = Object.keys(document.paths).filter(p => p.startsWith(`/api3/v${v}/`))
                for (let j = 0; j < paths.length; j++) {
                    delete document.paths[paths[j]]
                }
            }

            const url = `${globalPrefix}/v${v}/api/docs`

            DocumentationLoader.setupExpress(url, app, document)

            urls.push({
                url: url + '.json',
                name: this.DefaultApiDefinitionPrefix + v,
            })

            Logger.log(`Load version ${v} successful. URL: ${url}.json`, DocumentationLoader.name)
        }

        SwaggerModule.setup(`${globalPrefix}/api/docs`, app, null, {
            swaggerUrls: urls,
            include: [],
            swaggerOptions: {
                tagsSorter: (a: string, b: string) => a > b,
                defaultModelsExpandDepth: 0,
            },
        } as any)

        Logger.log(`Load docs successful. base URL: ${globalPrefix}/api/docs`, DocumentationLoader.name)
    }

    private static setupExpress(path: string, app: INestApplication, document: OpenAPIObject): void {
        const httpAdapter = app.getHttpAdapter()
        httpAdapter.get(path + '.json', (req, res) => res.json(document))
    }

    private static findModulesForControllers(modules: ModulesContainer, controllers: any): Type[] {
        const result: Type[] = []
        for (let i = 0; i < controllers.length; i++) {
            const currentController = controllers[i]
            const currentModules = [...modules.values()].filter(p => [...p.controllers.values()].findIndex(c => c.metatype == currentController) > -1)
            result.push(...currentModules.map(p => p.metatype))
        }
        return result
    }
}
