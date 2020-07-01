import { MigrationInterface, QueryRunner } from 'typeorm'

export class FirstAndLastNames1593605954231 implements MigrationInterface {
  name = 'FirstAndLastNames1593605954231'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "username"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "lastname"`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "first_name" text`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "last_name" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "last_name"`)
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "first_name"`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "lastname" text`)
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "username" text`)
  }

}
