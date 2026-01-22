import 'dotenv/config'
import path from 'path'
import { DataSource } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'postgres',
    entities: [path.join(__dirname, 'common/models/database/*.entity{.ts,.js}')],
    migrations: [path.join(__dirname, 'common/migrations/*{.ts,.js}')],
    migrationsRun: false,
    synchronize: false,
    logging: false,
})
