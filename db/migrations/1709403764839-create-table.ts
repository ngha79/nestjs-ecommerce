import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1709403764839 implements MigrationInterface {
    name = 'CreateTable1709403764839'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL DEFAULT '', \`background\` varchar(255) NOT NULL DEFAULT '', \`dateOfBirdth\` datetime NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_de87485f6489f5d0995f584195\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`address\` (\`id\` int NOT NULL AUTO_INCREMENT, \`address\` varchar(255) NOT NULL, \`isAddressDefault\` tinyint NOT NULL DEFAULT 0, \`phoneNumber\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`sold\` int NOT NULL DEFAULT '0', \`slug\` varchar(255) NOT NULL, \`isPublish\` tinyint NOT NULL DEFAULT 0, \`brand\` enum ('Thời trang', 'Giày dép', 'Sách', 'Thiết bị điện tử', 'Sắc đẹp', 'Sức khỏe', 'Đồ chơi', 'Chăm sóc thú cưng') NOT NULL, \`thumb\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`detail\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`shopId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reservation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`orderId\` int NULL, \`inventoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inventory\` (\`id\` int NOT NULL AUTO_INCREMENT, \`location\` varchar(255) NOT NULL, \`stock\` int NOT NULL DEFAULT '0', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`shopId\` varchar(36) NULL, \`productAttributeId\` int NULL, \`productId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_attribute\` (\`id\` int NOT NULL AUTO_INCREMENT, \`picture\` varchar(255) NOT NULL, \`thumb\` varchar(255) NOT NULL, \`size\` varchar(255) NOT NULL, \`material\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`productId\` varchar(36) NULL, \`inventoryId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`quantity\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`listOrderId\` varchar(36) NULL, \`productId\` varchar(36) NULL, \`productAttributeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`discount_user_used\` (\`id\` int NOT NULL AUTO_INCREMENT, \`total_used\` int NOT NULL, \`discountId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`discount\` (\`id\` varchar(36) NOT NULL, \`discount_name\` varchar(255) NOT NULL, \`discount_description\` varchar(255) NOT NULL, \`discount_code\` varchar(255) NOT NULL, \`discount_type\` enum ('percent', 'value') NOT NULL DEFAULT 'percent', \`discount_value\` int NOT NULL, \`discount_start_date\` datetime NOT NULL, \`discount_end_date\` datetime NOT NULL, \`discount_max_uses\` int NOT NULL, \`discount_max_value\` int NOT NULL, \`discount_use_count\` int NOT NULL DEFAULT '0', \`discount_uses_per_user\` int NOT NULL DEFAULT '1', \`discount_min_order_value\` int NOT NULL, \`discount_is_active\` tinyint NOT NULL DEFAULT 0, \`discount_apply_type\` enum ('all', 'specific') NOT NULL DEFAULT 'all', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`discountShopId\` varchar(36) NULL, UNIQUE INDEX \`IDX_4f49003be8fa244749c9d3c5c8\` (\`discount_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`list_order\` (\`id\` varchar(36) NOT NULL, \`total_price\` int NOT NULL, \`total_price_apply_discount\` int NOT NULL, \`tracking_number\` varchar(255) NOT NULL, \`status\` enum ('confirmed', 'pending', 'delivered', 'cancelled', 'shipping') NOT NULL DEFAULT 'pending', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`addressId\` int NULL, \`discountsId\` varchar(36) NULL, \`shopId\` varchar(36) NULL, UNIQUE INDEX \`REL_a0e63afe241dac3e2c1ad39e86\` (\`discountsId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_thumb\` varchar(255) NOT NULL, \`product_image_url\` varchar(255) NOT NULL, \`image_id\` varchar(255) NOT NULL, \`shopId\` varchar(36) NULL, \`productId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`shop\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`money\` int NOT NULL DEFAULT '0', \`isActive\` enum ('active', 'band', 'unactive') NOT NULL DEFAULT 'unactive', \`avatar\` varchar(255) NOT NULL DEFAULT '', \`background\` varchar(255) NOT NULL DEFAULT '', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_7d167898a50a2dada726851784\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`follows_user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userFollowId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`payment\` int NOT NULL DEFAULT '0', \`money\` int NOT NULL DEFAULT '0', \`avatar\` varchar(255) NOT NULL DEFAULT '', \`background\` varchar(255) NOT NULL DEFAULT '', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart\` (\`id\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cart-items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`total_product\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`productAttributeId\` int NULL, \`cartId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`conversation\` (\`id\` varchar(36) NOT NULL, \`conversation_name\` varchar(255) NOT NULL, \`conversation_status\` varchar(255) NOT NULL, \`conversation_block\` varchar(255) NOT NULL, \`conversation_slug\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAts\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`shopId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`messages\` (\`id\` int NOT NULL AUTO_INCREMENT, \`message\` varchar(255) NOT NULL, \`slug\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, \`shopId\` varchar(36) NULL, \`conversationId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`images_conversation\` (\`id\` int NOT NULL AUTO_INCREMENT, \`image\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`messagesId\` int NULL, \`conversationId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`key_token\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NOT NULL, \`publicKey\` varchar(255) NOT NULL, \`privateKey\` varchar(255) NOT NULL, \`refreshTokenUsed\` text NOT NULL, \`refreshToken\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_2bfb06d901c676c9afba0fd51c\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` varchar(36) NOT NULL, \`isRead\` tinyint NOT NULL DEFAULT 0, \`title\` varchar(255) NOT NULL, \`desc\` varchar(255) NOT NULL, \`url\` varchar(255) NOT NULL, \`userId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`address\` ADD CONSTRAINT \`FK_d25f1ea79e282cc8a42bd616aa3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD CONSTRAINT \`FK_1c4b1934c3e8c5b69b3d3d311d6\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reservation\` ADD CONSTRAINT \`FK_0b2f48efcd86bd3e6d82afec5cd\` FOREIGN KEY (\`inventoryId\`) REFERENCES \`inventory\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD CONSTRAINT \`FK_b53c1bad5d28db7088ac4231a4f\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD CONSTRAINT \`FK_c8622e1e24c6d054d36e8824490\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_attribute\` ADD CONSTRAINT \`FK_c0d597555330c0a972122bf4673\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order\` ADD CONSTRAINT \`FK_463886a942e50a46bb432355d9b\` FOREIGN KEY (\`listOrderId\`) REFERENCES \`list_order\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`discount_user_used\` ADD CONSTRAINT \`FK_ba015babf9099206f9ba9d4f2fb\` FOREIGN KEY (\`discountId\`) REFERENCES \`discount\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`list_order\` ADD CONSTRAINT \`FK_fcb3228a73f6002c5457773acb0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`list_order\` ADD CONSTRAINT \`FK_a0e63afe241dac3e2c1ad39e863\` FOREIGN KEY (\`discountsId\`) REFERENCES \`discount\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`list_order\` ADD CONSTRAINT \`FK_17d83833cc688ba90e2b61e66da\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_44b26c7fba7ecec077678cc6414\` FOREIGN KEY (\`shopId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`product_image\` ADD CONSTRAINT \`FK_40ca0cd115ef1ff35351bed8da2\` FOREIGN KEY (\`productId\`) REFERENCES \`product_attribute\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`follows_user\` ADD CONSTRAINT \`FK_0ff9f85d2592308d9535587aa91\` FOREIGN KEY (\`userFollowId\`) REFERENCES \`shop\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cart-items\` ADD CONSTRAINT \`FK_9600f8e29eedc98e76181d6b5bb\` FOREIGN KEY (\`cartId\`) REFERENCES \`cart\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`images_conversation\` ADD CONSTRAINT \`FK_068f2954486db720eec39e5c753\` FOREIGN KEY (\`messagesId\`) REFERENCES \`messages\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`images_conversation\` ADD CONSTRAINT \`FK_6d30d22055948f89c3863626878\` FOREIGN KEY (\`conversationId\`) REFERENCES \`conversation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`notification\` ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\``);
        await queryRunner.query(`ALTER TABLE \`images_conversation\` DROP FOREIGN KEY \`FK_6d30d22055948f89c3863626878\``);
        await queryRunner.query(`ALTER TABLE \`images_conversation\` DROP FOREIGN KEY \`FK_068f2954486db720eec39e5c753\``);
        await queryRunner.query(`ALTER TABLE \`cart-items\` DROP FOREIGN KEY \`FK_9600f8e29eedc98e76181d6b5bb\``);
        await queryRunner.query(`ALTER TABLE \`follows_user\` DROP FOREIGN KEY \`FK_0ff9f85d2592308d9535587aa91\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_40ca0cd115ef1ff35351bed8da2\``);
        await queryRunner.query(`ALTER TABLE \`product_image\` DROP FOREIGN KEY \`FK_44b26c7fba7ecec077678cc6414\``);
        await queryRunner.query(`ALTER TABLE \`list_order\` DROP FOREIGN KEY \`FK_17d83833cc688ba90e2b61e66da\``);
        await queryRunner.query(`ALTER TABLE \`list_order\` DROP FOREIGN KEY \`FK_a0e63afe241dac3e2c1ad39e863\``);
        await queryRunner.query(`ALTER TABLE \`list_order\` DROP FOREIGN KEY \`FK_fcb3228a73f6002c5457773acb0\``);
        await queryRunner.query(`ALTER TABLE \`discount_user_used\` DROP FOREIGN KEY \`FK_ba015babf9099206f9ba9d4f2fb\``);
        await queryRunner.query(`ALTER TABLE \`order\` DROP FOREIGN KEY \`FK_463886a942e50a46bb432355d9b\``);
        await queryRunner.query(`ALTER TABLE \`product_attribute\` DROP FOREIGN KEY \`FK_c0d597555330c0a972122bf4673\``);
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP FOREIGN KEY \`FK_c8622e1e24c6d054d36e8824490\``);
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP FOREIGN KEY \`FK_b53c1bad5d28db7088ac4231a4f\``);
        await queryRunner.query(`ALTER TABLE \`reservation\` DROP FOREIGN KEY \`FK_0b2f48efcd86bd3e6d82afec5cd\``);
        await queryRunner.query(`ALTER TABLE \`product\` DROP FOREIGN KEY \`FK_1c4b1934c3e8c5b69b3d3d311d6\``);
        await queryRunner.query(`ALTER TABLE \`address\` DROP FOREIGN KEY \`FK_d25f1ea79e282cc8a42bd616aa3\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_2bfb06d901c676c9afba0fd51c\` ON \`key_token\``);
        await queryRunner.query(`DROP TABLE \`key_token\``);
        await queryRunner.query(`DROP TABLE \`images_conversation\``);
        await queryRunner.query(`DROP TABLE \`messages\``);
        await queryRunner.query(`DROP TABLE \`conversation\``);
        await queryRunner.query(`DROP TABLE \`cart-items\``);
        await queryRunner.query(`DROP TABLE \`cart\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`follows_user\``);
        await queryRunner.query(`DROP INDEX \`IDX_7d167898a50a2dada726851784\` ON \`shop\``);
        await queryRunner.query(`DROP TABLE \`shop\``);
        await queryRunner.query(`DROP TABLE \`product_image\``);
        await queryRunner.query(`DROP INDEX \`REL_a0e63afe241dac3e2c1ad39e86\` ON \`list_order\``);
        await queryRunner.query(`DROP TABLE \`list_order\``);
        await queryRunner.query(`DROP INDEX \`IDX_4f49003be8fa244749c9d3c5c8\` ON \`discount\``);
        await queryRunner.query(`DROP TABLE \`discount\``);
        await queryRunner.query(`DROP TABLE \`discount_user_used\``);
        await queryRunner.query(`DROP TABLE \`order\``);
        await queryRunner.query(`DROP TABLE \`product_attribute\``);
        await queryRunner.query(`DROP TABLE \`inventory\``);
        await queryRunner.query(`DROP TABLE \`reservation\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP TABLE \`address\``);
        await queryRunner.query(`DROP INDEX \`IDX_de87485f6489f5d0995f584195\` ON \`admin\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
    }

}
