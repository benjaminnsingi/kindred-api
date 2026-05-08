import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMeetingsTable1778233650991 implements MigrationInterface {
    name = 'CreateMeetingsTable1778233650991'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "meetings" ("id" uuid NOT NULL, "host_id" uuid NOT NULL, "title" character varying(200) NOT NULL, "description" text, "scheduled_at" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(20) NOT NULL, "meeting_code" character varying(20) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aa73be861afa77eb4ed31f3ed57" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6bf7c3bf900ea781101614178d" ON "meetings" ("host_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d18be740055cddc6b157c36ea6" ON "meetings" ("status") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_23734e73d5f5caadf1869dde08" ON "meetings" ("meeting_code") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_23734e73d5f5caadf1869dde08"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d18be740055cddc6b157c36ea6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bf7c3bf900ea781101614178d"`);
        await queryRunner.query(`DROP TABLE "meetings"`);
    }

}
