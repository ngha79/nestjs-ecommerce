import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableAddressShop1711684874469 implements MigrationInterface {
    name = 'UpdateTableAddressShop1711684874469'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`address_shop\` ADD \`shopId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`address_shop\` ADD UNIQUE INDEX \`IDX_2a61723bd775ddb621380daf5b\` (\`shopId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_2a61723bd775ddb621380daf5b\` ON \`address_shop\` (\`shopId\`)`);
        await queryRunner.query(`ALTER TABLE \`address_shop\` ADD CONSTRAINT \`FK_2a61723bd775ddb621380daf5b8\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`address_shop\` DROP FOREIGN KEY \`FK_2a61723bd775ddb621380daf5b8\``);
        await queryRunner.query(`DROP INDEX \`REL_2a61723bd775ddb621380daf5b\` ON \`address_shop\``);
        await queryRunner.query(`ALTER TABLE \`address_shop\` DROP INDEX \`IDX_2a61723bd775ddb621380daf5b\``);
        await queryRunner.query(`ALTER TABLE \`address_shop\` DROP COLUMN \`shopId\``);
    }

}
