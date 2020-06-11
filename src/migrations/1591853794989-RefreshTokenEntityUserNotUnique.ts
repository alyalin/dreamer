import {MigrationInterface, QueryRunner} from "typeorm";

export class RefreshTokenEntityUserNotUnique1591853794989 implements MigrationInterface {
    name = 'RefreshTokenEntityUserNotUnique1591853794989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token_entity" DROP CONSTRAINT "UQ_06d69eb4c771cb92bab441f67a2"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token_entity" ADD CONSTRAINT "UQ_06d69eb4c771cb92bab441f67a2" UNIQUE ("user_id")`);
    }

}
