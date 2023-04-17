import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1681691428402 implements MigrationInterface {
  name = 'Init1681691428402'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstname" character varying(50) NOT NULL, "lastname" character varying(50) NOT NULL, "email" bytea NOT NULL, "password" bytea NOT NULL, "salt" character varying(32) NOT NULL, "balance" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'USD', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ee66de6cdc53993296d1ceb8aa" ON "accounts" ("email") `
    )
    await queryRunner.query(
      `CREATE TABLE "transfer" ("id" SERIAL NOT NULL, "accountId" uuid NOT NULL, "type" character varying(20) NOT NULL, "amount" numeric(10,2) NOT NULL, "currency" character varying(3) NOT NULL DEFAULT 'USD', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "account_id" uuid, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`
    )
    await queryRunner.query(
      `ALTER TABLE "transfer" ADD CONSTRAINT "FK_bc8d11fdb46573269220c45af52" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transfer" DROP CONSTRAINT "FK_bc8d11fdb46573269220c45af52"`
    )
    await queryRunner.query(`DROP TABLE "transfer"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ee66de6cdc53993296d1ceb8aa"`
    )
    await queryRunner.query(`DROP TABLE "accounts"`)
  }
}
