import { MigrationInterface, QueryRunner } from 'typeorm'

export class ChangePublishDateType1737549500000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "articles" ALTER COLUMN "publish_date" TYPE date')
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "articles" ALTER COLUMN "publish_date" TYPE timestamp')
    }
}
