import { MigrationInterface, QueryRunner } from 'typeorm'

export class EmailNullable1593948632972 implements MigrationInterface {
  name = 'EmailNullable1593948632972'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "email" DROP NOT NULL`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "email" SET NOT NULL`)
  }

}
