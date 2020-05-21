import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1590091549736 implements MigrationInterface {
    name = 'UserMigration1590091549736'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sessions_entity" ("user_id" uuid NOT NULL, "session_id" text NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f2789569cc76ce1411f2e388a51" UNIQUE ("user_id"), CONSTRAINT "PK_dfb79033e429537cd9e91dbd158" PRIMARY KEY ("session_id"))`);
        await queryRunner.query(`CREATE TABLE "user_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "email" text NOT NULL, "username" text NOT NULL, "password" text NOT NULL, "facebook_id" text NOT NULL, "instagram_id" text NOT NULL, "vk_id" text NOT NULL, "checkbox" boolean NOT NULL, "verified" boolean NOT NULL, CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), CONSTRAINT "UQ_040a7299a52efa2b0ed7683c41c" UNIQUE ("facebook_id"), CONSTRAINT "UQ_887fe85e53a03be2b8cea8cb2b8" UNIQUE ("instagram_id"), CONSTRAINT "UQ_9ed8046836e0f4e80f21a4ea871" UNIQUE ("vk_id"), CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_entity"`);
        await queryRunner.query(`DROP TABLE "sessions_entity"`);
    }

}
