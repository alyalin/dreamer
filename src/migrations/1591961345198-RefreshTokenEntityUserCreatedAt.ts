import {MigrationInterface, QueryRunner} from "typeorm";

export class RefreshTokenEntityUserCreatedAt1591961345198 implements MigrationInterface {
    name = 'RefreshTokenEntityUserCreatedAt1591961345198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token_entity" ADD "created_at" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_token_entity" DROP COLUMN "created_at"`);
    }

}
