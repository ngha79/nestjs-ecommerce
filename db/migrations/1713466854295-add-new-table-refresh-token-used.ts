import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewTableRefreshTokenUsed1713466854295 implements MigrationInterface {
    name = 'AddNewTableRefreshTokenUsed1713466854295'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_a13d57c5ee113366da6311bf927\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_29c8a3ca25994cf49e36cd93449\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_cc3d1ae8748d5f33c9117ae5530\``);
        await queryRunner.query(`CREATE TABLE \`refresh_token_used\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`keyTokenIdId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopCommentId\``);
        await queryRunner.query(`ALTER TABLE \`key_token\` DROP COLUMN \`refreshTokenUsed\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`commentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopCommentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_29c8a3ca25994cf49e36cd93449\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_cc3d1ae8748d5f33c9117ae5530\` FOREIGN KEY (\`shopCommentId\`) REFERENCES \`shop_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_a13d57c5ee113366da6311bf927\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refresh_token_used\` ADD CONSTRAINT \`FK_4a6e25d1510fbde17ff962f7ff7\` FOREIGN KEY (\`keyTokenIdId\`) REFERENCES \`key_token\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_token_used\` DROP FOREIGN KEY \`FK_4a6e25d1510fbde17ff962f7ff7\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_a13d57c5ee113366da6311bf927\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_cc3d1ae8748d5f33c9117ae5530\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_29c8a3ca25994cf49e36cd93449\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopCommentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`key_token\` ADD \`refreshTokenUsed\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopCommentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`commentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`productId\` varchar(36) NULL`);
        await queryRunner.query(`DROP TABLE \`refresh_token_used\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_cc3d1ae8748d5f33c9117ae5530\` FOREIGN KEY (\`shopCommentId\`) REFERENCES \`shop_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_29c8a3ca25994cf49e36cd93449\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_a13d57c5ee113366da6311bf927\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
