import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1590092040612 implements MigrationInterface {
    name = 'UserMigration1590092040612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "checkbox"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "checkbox" boolean NOT NULL`);
    }

}
