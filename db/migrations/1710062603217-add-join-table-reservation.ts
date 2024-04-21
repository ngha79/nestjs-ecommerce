import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJoinTableReservation1710062603217 implements MigrationInterface {
    name = 'AddJoinTableReservation1710062603217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`inventory\` DROP COLUMN \`location\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`inventory\` ADD \`location\` varchar(255) NOT NULL`);
    }

}
