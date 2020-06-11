import {MigrationInterface, QueryRunner} from "typeorm";

export class RefreshTokenEntity1591812385366 implements MigrationInterface {
    name = 'RefreshTokenEntity1591812385366'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token_entity" ("user_id" uuid NOT NULL, "refresh_token" text NOT NULL, "expires_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_06d69eb4c771cb92bab441f67a2" UNIQUE ("user_id"), CONSTRAINT "PK_c5fddbbb89a5c835c87409cbcdc" PRIMARY KEY ("refresh_token"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "refresh_token_entity"`);
    }

}
