import { Injectable } from '@nestjs/common'
// import { QueryTypes } from 'sequelize'
// import { Sequelize } from 'sequelize-typescript'

@Injectable()
export class HealthCheckService {
    // constructor(private sequelize: Sequelize) {}
    async healthCheck(): Promise<any> {
        return { status: 'ok' }
        // try {
        //     await this.sequelize.authenticate()
        //     const [results] = await this.sequelize.query<Record<string, any>[]>('SELECT pg_is_in_recovery();', { type: QueryTypes.SELECT })
        //     return results[0]['pg_is_in_recovery'] === false ? 'ok' : 'error. pg_is_in_recovery'
        // } catch (error) {
        //     throw new Error(error)
        // }
    }
}
