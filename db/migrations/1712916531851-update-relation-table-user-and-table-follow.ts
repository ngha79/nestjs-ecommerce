import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateRelationTableUserAndTableFollow1712916531851 implements MigrationInterface {
    name = 'UpdateRelationTableUserAndTableFollow1712916531851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_a13d57c5ee113366da6311bf927\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_29c8a3ca25994cf49e36cd93449\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_cc3d1ae8748d5f33c9117ae5530\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopCommentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`commentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopCommentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`follows_user\` ADD \`userId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_29c8a3ca25994cf49e36cd93449\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_cc3d1ae8748d5f33c9117ae5530\` FOREIGN KEY (\`shopCommentId\`) REFERENCES \`shop_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_a13d57c5ee113366da6311bf927\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`follows_user\` ADD CONSTRAINT \`FK_b5f7d5b5674eb2c8d922b366b7a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`follows_user\` DROP FOREIGN KEY \`FK_b5f7d5b5674eb2c8d922b366b7a\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_a13d57c5ee113366da6311bf927\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_cc3d1ae8748d5f33c9117ae5530\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_29c8a3ca25994cf49e36cd93449\``);
        await queryRunner.query(`ALTER TABLE \`follows_user\` DROP COLUMN \`userId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopCommentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopCommentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`commentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_cc3d1ae8748d5f33c9117ae5530\` FOREIGN KEY (\`shopCommentId\`) REFERENCES \`shop_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_29c8a3ca25994cf49e36cd93449\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_a13d57c5ee113366da6311bf927\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
