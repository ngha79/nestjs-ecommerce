import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewTableReviews1711006583415 implements MigrationInterface {
    name = 'AddNewTableReviews1711006583415'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`comment_image\` (\`id\` varchar(36) NOT NULL, \`image_url\` varchar(255) NOT NULL, \`image_id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`productId\` varchar(36) NULL, \`commentId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shop_comment_image\` (\`id\` varchar(36) NOT NULL, \`image_url\` varchar(255) NOT NULL, \`image_id\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`shopId\` varchar(36) NULL, \`commentId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shop_comment\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`shopId\` varchar(36) NULL, \`commentId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`rating\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`productId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`report\` (\`id\` varchar(36) NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`commentId\` varchar(36) NULL, \`productId\` varchar(36) NULL, \`shopId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comment_image\` ADD CONSTRAINT \`FK_822c34dd7305becc479d898595f\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment_image\` ADD CONSTRAINT \`FK_95a86d14dbaa8f907840d5640e0\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shop_comment_image\` ADD CONSTRAINT \`FK_e952784220ffe15abbafe782f8a\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shop_comment_image\` ADD CONSTRAINT \`FK_5e03a1b0fc9491380e79798e32b\` FOREIGN KEY (\`commentId\`) REFERENCES \`shop_comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shop_comment\` ADD CONSTRAINT \`FK_6db46354d6d01ccd1f6bf99c8f8\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`shop_comment\` ADD CONSTRAINT \`FK_9b0433faa9489378c5f3d36b21d\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_1e9f24a68bd2dcd6390a4008395\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_e347c56b008c2057c9887e230aa\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_97372830f2390803a3e2df4a46e\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_2977b14ac9fdbd2597728d4e3b3\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`report\` ADD CONSTRAINT \`FK_2c88e7648f42d9d4380ebfe89f1\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_2c88e7648f42d9d4380ebfe89f1\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_2977b14ac9fdbd2597728d4e3b3\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_97372830f2390803a3e2df4a46e\``);
        await queryRunner.query(`ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_e347c56b008c2057c9887e230aa\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_1e9f24a68bd2dcd6390a4008395\``);
        await queryRunner.query(`ALTER TABLE \`shop_comment\` DROP FOREIGN KEY \`FK_9b0433faa9489378c5f3d36b21d\``);
        await queryRunner.query(`ALTER TABLE \`shop_comment\` DROP FOREIGN KEY \`FK_6db46354d6d01ccd1f6bf99c8f8\``);
        await queryRunner.query(`ALTER TABLE \`shop_comment_image\` DROP FOREIGN KEY \`FK_5e03a1b0fc9491380e79798e32b\``);
        await queryRunner.query(`ALTER TABLE \`shop_comment_image\` DROP FOREIGN KEY \`FK_e952784220ffe15abbafe782f8a\``);
        await queryRunner.query(`ALTER TABLE \`comment_image\` DROP FOREIGN KEY \`FK_95a86d14dbaa8f907840d5640e0\``);
        await queryRunner.query(`ALTER TABLE \`comment_image\` DROP FOREIGN KEY \`FK_822c34dd7305becc479d898595f\``);
        await queryRunner.query(`DROP TABLE \`report\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`shop_comment\``);
        await queryRunner.query(`DROP TABLE \`shop_comment_image\``);
        await queryRunner.query(`DROP TABLE \`comment_image\``);
    }

}
