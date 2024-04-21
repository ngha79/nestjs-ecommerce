import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableImageProduct1709833023142 implements MigrationInterface {
    name = 'UpdateTableImageProduct1709833023142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``);
        await queryRunner.query(`ALTER TABLE \`discount_user_used\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD \`productId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`discount_user_used\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product_attribute\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
