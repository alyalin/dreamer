import { MigrationInterface, QueryRunner } from 'typeorm'

export class UserLastName1593269503993 implements MigrationInterface {
  name = 'UserLastName1593269503993'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ADD "lastname" text`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "lastname"`)
  }

}
