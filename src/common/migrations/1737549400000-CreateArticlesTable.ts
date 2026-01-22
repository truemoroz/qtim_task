import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm'

export class CreateArticlesTable1737549400000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'articles',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        isNullable: false,
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'publish_date',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'author_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
            true,
        )

        await queryRunner.createForeignKey(
            'articles',
            new TableForeignKey({
                columnNames: ['author_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'authors',
                onDelete: 'SET NULL',
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('articles')
        const foreignKey = table.foreignKeys.find(fk => fk.columnNames.indexOf('author_id') !== -1)
        if (foreignKey) {
            await queryRunner.dropForeignKey('articles', foreignKey)
        }
        await queryRunner.dropTable('articles')
    }
}
