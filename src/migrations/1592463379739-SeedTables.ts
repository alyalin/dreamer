import {MigrationInterface, QueryRunner} from "typeorm";

export class SeedTables1592463379739 implements MigrationInterface {
    name = 'SeedTables1592463379739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "refresh_token_entity" ("user_id" uuid NOT NULL, "refresh_token" text NOT NULL, "expires_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_c5fddbbb89a5c835c87409cbcdc" PRIMARY KEY ("refresh_token"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "email" text NOT NULL, "username" text, "password" text NOT NULL, "facebook_id" text, "instagram_id" text, "vk_id" text, "checkbox" boolean NOT NULL DEFAULT false, "verified" boolean NOT NULL DEFAULT false, "role" text NOT NULL DEFAULT 'user', CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "refresh_token_entity"`);
    }

}
