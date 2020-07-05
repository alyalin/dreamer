import { MigrationInterface, QueryRunner } from 'typeorm'

export class PasswordNullable1593948807669 implements MigrationInterface {
  name = 'PasswordNullable1593948807669'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "password" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "password" SET NOT NULL`)
  }

}
