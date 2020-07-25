import { MigrationInterface, QueryRunner } from 'typeorm'

export class LinksEntity1594660384158 implements MigrationInterface {
  name = 'LinksEntity1594660384158'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "links_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hash" text NOT NULL, "created" TIMESTAMP NOT NULL DEFAULT now(), "delete_date" TIMESTAMP NOT NULL, "type" text NOT NULL, "user_id" uuid, CONSTRAINT "PK_e8f1c0deec0ca1ccecb19e293eb" PRIMARY KEY ("id"))`)
    await queryRunner.query(`ALTER TABLE "links_entity" ADD CONSTRAINT "FK_1ec2aa3e3910f67a9aab30c8d4f" FOREIGN KEY ("user_id") REFERENCES "user_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "links_entity" DROP CONSTRAINT "FK_1ec2aa3e3910f67a9aab30c8d4f"`)
    await queryRunner.query(`DROP TABLE "links_entity"`)
  }

}
