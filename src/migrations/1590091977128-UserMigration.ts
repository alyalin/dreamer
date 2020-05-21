import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1590091977128 implements MigrationInterface {
    name = 'UserMigration1590091977128'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "username" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "facebook_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "instagram_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "vk_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "verified" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "verified" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "vk_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "instagram_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "facebook_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "username" SET NOT NULL`);
    }

}
