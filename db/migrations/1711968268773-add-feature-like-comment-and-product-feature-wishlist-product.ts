import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFeatureLikeCommentAndProductFeatureWishlistProduct1711968268773 implements MigrationInterface {
    name = 'AddFeatureLikeCommentAndProductFeatureWishlistProduct1711968268773'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_2a61723bd775ddb621380daf5b\` ON \`address_shop\``);
        await queryRunner.query(`CREATE TABLE \`like_product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(36) NULL, \`shopId\` varchar(36) NULL, \`commentId\` varchar(36) NULL, \`shopCommentId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`wishlist\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(36) NULL, \`productId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopCommentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`commentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopCommentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`productId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_f5c257a88ac769a2efe34ec7529\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_93f545f7224ab6fba3934ab2896\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_29c8a3ca25994cf49e36cd93449\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_cc3d1ae8748d5f33c9117ae5530\` FOREIGN KEY (\`shopCommentId\`) REFERENCES \`shop_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD CONSTRAINT \`FK_a13d57c5ee113366da6311bf927\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wishlist\` ADD CONSTRAINT \`FK_f6eeb74a295e2aad03b76b0ba87\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`wishlist\` ADD CONSTRAINT \`FK_17e00e49d77ccaf7ff0e14de37b\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wishlist\` DROP FOREIGN KEY \`FK_17e00e49d77ccaf7ff0e14de37b\``);
        await queryRunner.query(`ALTER TABLE \`wishlist\` DROP FOREIGN KEY \`FK_f6eeb74a295e2aad03b76b0ba87\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_a13d57c5ee113366da6311bf927\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_cc3d1ae8748d5f33c9117ae5530\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_29c8a3ca25994cf49e36cd93449\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_93f545f7224ab6fba3934ab2896\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP FOREIGN KEY \`FK_f5c257a88ac769a2efe34ec7529\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`productId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopCommentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`commentId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` DROP COLUMN \`shopId\``);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopCommentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`commentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`like_product\` ADD \`shopId\` varchar(36) NULL`);
        await queryRunner.query(`DROP TABLE \`wishlist\``);
        await queryRunner.query(`DROP TABLE \`like_product\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_2a61723bd775ddb621380daf5b\` ON \`address_shop\` (\`shopId\`)`);
    }

}
