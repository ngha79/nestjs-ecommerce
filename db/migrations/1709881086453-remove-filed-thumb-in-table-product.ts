import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveFiledThumbInTableProduct1709881086453 implements MigrationInterface {
    name = 'RemoveFiledThumbInTableProduct1709881086453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`thumb\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`thumb\` varchar(255) NOT NULL`);
    }

}
