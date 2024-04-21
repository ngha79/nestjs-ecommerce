import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableAddressShop1711684397459 implements MigrationInterface {
    name = 'UpdateTableAddressShop1711684397459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_9b3098622ff4a03f30280b102d\` ON \`address_shop\``);
        await queryRunner.query(`ALTER TABLE \`address_shop\` DROP COLUMN \`shopId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`address_shop\` ADD \`shopId\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_9b3098622ff4a03f30280b102d\` ON \`address_shop\` (\`shopId\`)`);
    }

}
