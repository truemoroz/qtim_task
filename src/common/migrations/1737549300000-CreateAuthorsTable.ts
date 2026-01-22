import { MigrationInterface, QueryRunner, Table } from 'typeorm'

export class CreateAuthorsTable1737549300000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'authors',
                columns: [
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'firstname',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'secondname',
                        type: 'varchar',
                        isNullable: false,
                    },
                ],
            }),
            true,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('authors')
    }
}
