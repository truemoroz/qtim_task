import { DynamicModule } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { SqlLogger } from '@/common/lib/log/loggers/SqlLogger'
import { ConfigLoader } from '@/common/lib/configuration/ConfigLoader'
import { DatabaseConfig } from '@/common/models/config'
import { SequelizeModuleOptions } from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface'
import path from 'path'

export class ServiceSequelizeModule {
    // private static readonly ModelDirs = ['pos']
    private static readonly ModelDirs: string[] = []

    public static forRoot(): DynamicModule {
        const dbConfig = ConfigLoader.getModelConfig(DatabaseConfig)

        const sequelizeConnectionConfig: SequelizeModuleOptions = {
            dialect: 'postgres',
            models: this.getAbsoluteModelPaths(),
            port: dbConfig.port,
            username: dbConfig.user,
            password: dbConfig.password,
            database: dbConfig.database,
            define: {
                freezeTableName: true,
                timestamps: false,
            },
            pool: {
                min: dbConfig.minPoolConnections,
                max: dbConfig.maxPoolConnections,
                acquire: dbConfig.acquireTimeout,
            },
            logging: SqlLogger.logQuery,
            benchmark: true,
        }

        if (dbConfig.replicaHost) {
            sequelizeConnectionConfig.replication = {
                write: {
                    host: dbConfig.host,
                },
                read: [
                    {
                        host: dbConfig.replicaHost,
                    },
                ],
            }
        } else {
            sequelizeConnectionConfig.host = dbConfig.host
        }

        return SequelizeModule.forRoot(sequelizeConnectionConfig)
    }

    private static getAbsoluteModelPaths(): string[] {
        const basePath = path.resolve(__dirname, '..', '..', 'common', 'models', 'database')
        const additionalPaths = this.ModelDirs.map(p => path.resolve(basePath, p))
        return [
            basePath,
            ...additionalPaths,
        ]
    }
}
