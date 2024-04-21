import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableAddressShop1711641564224 implements MigrationInterface {
    name = 'CreateTableAddressShop1711641564224'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`address_shop\` (\`id\` int NOT NULL AUTO_INCREMENT, \`shop\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`userName\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_9b3098622ff4a03f30280b102d\` (\`shop\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_9b3098622ff4a03f30280b102d\` ON \`address_shop\``);
        await queryRunner.query(`DROP TABLE \`address_shop\``);
    }

}
