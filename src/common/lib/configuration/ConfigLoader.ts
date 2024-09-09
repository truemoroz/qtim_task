import fs from 'fs'
import yaml from 'js-yaml'
import { Constructor } from '@nestjs/common/utils/merge-with-values.util'
import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
import { ValidationError as ValidateError } from 'class-validator/types/validation/ValidationError'
import { Logger } from '@nestjs/common'
import { CONFIG_MODEL_META } from '@/common/lib/configuration/decorators/ConfigModelDecorator'

export class ConfigLoader {
    public static config: Record<string, any>

    private static configModels: Constructor<any>[] = []

    public static addConfigModel(model: Constructor<any>): void {
        this.configModels.push(model)
    }

    public static load(env?: Record<string, any>, envName = process.env.NODE_ENV): () => Record<string, any> {
        return () => this.loadAll(env, envName)
    }

    public static loadAll(env?: Record<string, any>, envName = process.env.NODE_ENV): Record<string, any> {
        const configPath = process.cwd() + '/config'
        const baseYaml = fs.readFileSync(`${configPath}/app.yaml`, 'utf-8')
        let envYaml = ''
        if (fs.existsSync(`${configPath}/app.${envName}.yaml`)) {
            envYaml = fs.readFileSync(`${configPath}/app.${envName}.yaml`, 'utf-8')
        }
        const baseConfig = yaml.load(baseYaml)
        const envConfig = yaml.load(envYaml)
        const config = Object.assign(baseConfig, envConfig)
        const resultConfig = this.setObjectFromEnv(config, env || {})
        this.config = resultConfig
        this.validateConfig()
        return resultConfig
    }

    public static getModelConfig<T>(model: Constructor<T>): T {
        const configPath = Reflect.getMetadata(CONFIG_MODEL_META, model)
        const configObject = configPath.split('.').reduce((previousValue: Record<string, any>, currentValue: string) => {
            if (previousValue[currentValue]) {
                return previousValue[currentValue]
            }
            return {}
        }, this.config || {})
        if (!configObject) {
            throw new Error(`Config section not found for model ${model.name}. Config path: ${configPath}`)
        }
        return plainToInstance(model, configObject, { exposeDefaultValues: true })
    }

    public static validateConfig(): void {
        for (let i = 0; i < this.configModels.length; i++) {
            const configModel = this.configModels[i]
            const classConfig = this.getModelConfig(configModel)
            this.validateModel(classConfig)
        }
    }

    public static validateModel<T>(modelConfig: Constructor<T>): void {
        const errors = validateSync(modelConfig)
        if (errors.length > 0) {
            const configPath = Reflect.getMetadata(CONFIG_MODEL_META, modelConfig.constructor)
            const fields = {
                [configPath]: this.makeErrorFieldsRecursive(errors),
            }
            Logger.error('Config validation error', fields)
            process.exit(1)
        }
    }

    private static setObjectFromEnv(config: Record<string, any>, env: Record<string, any>): Record<string, any> {
        const keys = Object.keys(config)
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const val = config[key]
            if (!val) {
                config[key] = val
                continue
            }
            if (typeof val === 'object') {
                config[key] = this.setObjectFromEnv(config[key], env)
            } else if (Array.isArray(val)) {
                config[key] = this.setArrayFromEnv(config[key], env)
            } else {
                config[key] = this.replaceValueIfNeeded(config[key], env)
            }
        }
        return config
    }

    private static setArrayFromEnv(config: Array<any>, env: Record<string, any>): Array<any> {
        for (let i = 0; i < config.length; i++) {
            if (typeof config[i] === 'object') {
                config[i] = this.setObjectFromEnv(config[i], env)
            } else if (Array.isArray(config[i])) {
                config[i] = this.setArrayFromEnv(config[i], env)
            } else {
                config[i] = this.replaceValueIfNeeded(config[i], env)
            }
        }
        return config
    }

    private static replaceValueIfNeeded(initVal: string, env: Record<string, any>): string {
        if (typeof initVal !== 'string') {
            return initVal
        }
        const matches = initVal.match(/\${[A-Z0-9_]+}/)
        if (!matches) {
            return initVal
        }
        for (let i = 0; i < matches.length; i++) {
            const baseKey = matches[i]
            const variableName = baseKey.substring(2, baseKey.length - 1)
            if (env[variableName]) {
                initVal = initVal.replace(baseKey, env[variableName])
            } else {
                initVal = initVal.replace(baseKey, '')
            }
        }
        return initVal || undefined
    }

    private static makeErrorFieldsRecursive(errors: ValidateError[]): Record<string, any> {
        const fields: Record<string, any> = {}
        for (let i = 0; i < errors.length; i++) {
            const err = errors[i]
            if (err.children && err.children.length > 0) {
                fields[err.property] = this.makeErrorFieldsRecursive(err.children)
            } else {
                fields[err.property] = Object.values(err.constraints)
            }
        }
        return fields
    }
}
