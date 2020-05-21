import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1590091710260 implements MigrationInterface {
    name = 'UserMigration1590091710260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_040a7299a52efa2b0ed7683c41c"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_887fe85e53a03be2b8cea8cb2b8"`);
        await queryRunner.query(`ALTER TABLE "user_entity" DROP CONSTRAINT "UQ_9ed8046836e0f4e80f21a4ea871"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_9ed8046836e0f4e80f21a4ea871" UNIQUE ("vk_id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_887fe85e53a03be2b8cea8cb2b8" UNIQUE ("instagram_id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_040a7299a52efa2b0ed7683c41c" UNIQUE ("facebook_id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username")`);
    }

}
