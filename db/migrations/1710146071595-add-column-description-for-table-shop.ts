import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnDescriptionForTableShop1710146071595 implements MigrationInterface {
    name = 'AddColumnDescriptionForTableShop1710146071595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\` ADD \`description\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shop\` DROP COLUMN \`description\``);
    }

}
