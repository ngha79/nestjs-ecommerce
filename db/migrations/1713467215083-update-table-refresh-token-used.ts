import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableRefreshTokenUsed1713467215083 implements MigrationInterface {
    name = 'UpdateTableRefreshTokenUsed1713467215083'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_a13d57c5ee113366da6311bf927\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_29c8a3ca25994cf49e36cd93449\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_cc3d1ae8748d5f33c9117ae5530\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token_used\` DROP FOREIGN KEY \`FK_4a6e25d1510fbde17ff962f7ff7\``);
        await queryRunner.query(`ALTER TABLE \`refresh_token_used\` CHANGE \`keyTokenIdId\` \`keyTokenId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopCommentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`commentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopCommentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_29c8a3ca25994cf49e36cd93449\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_cc3d1ae8748d5f33c9117ae5530\` FOREIGN KEY (\`shopCommentId\`) REFERENCES \`shop_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_a13d57c5ee113366da6311bf927\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`refresh_token_used\` ADD CONSTRAINT \`FK_40d5a89432c26e1175908258f6f\` FOREIGN KEY (\`keyTokenId\`) REFERENCES \`key_token\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_token_used\` DROP FOREIGN KEY \`FK_40d5a89432c26e1175908258f6f\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_a13d57c5ee113366da6311bf927\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_cc3d1ae8748d5f33c9117ae5530\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_29c8a3ca25994cf49e36cd93449\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopCommentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopCommentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`commentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`refresh_token_used\` CHANGE \`keyTokenId\` \`keyTokenIdId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`refresh_token_used\` ADD CONSTRAINT \`FK_4a6e25d1510fbde17ff962f7ff7\` FOREIGN KEY (\`keyTokenIdId\`) REFERENCES \`key_token\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_cc3d1ae8748d5f33c9117ae5530\` FOREIGN KEY (\`shopCommentId\`) REFERENCES \`shop_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_29c8a3ca25994cf49e36cd93449\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_a13d57c5ee113366da6311bf927\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
