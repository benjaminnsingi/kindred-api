import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateParticipantsTable1778322576367 implements MigrationInterface {
    name = 'CreateParticipantsTable1778322576367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "participants" ("id" uuid NOT NULL, "meeting_id" uuid NOT NULL, "user_id" uuid NOT NULL, "role" character varying(20) NOT NULL, "joined_at" TIMESTAMP WITH TIME ZONE NOT NULL, "left_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_1cda06c31eec1c95b3365a0283f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_312c4bd27652ce9b2f7e847476" ON "participants" ("meeting_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1427a77e06023c250ed3794a1b" ON "participants" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_participants_user_meeting" ON "participants" ("user_id", "meeting_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_participants_user_meeting"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1427a77e06023c250ed3794a1b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_312c4bd27652ce9b2f7e847476"`);
        await queryRunner.query(`DROP TABLE "participants"`);
    }

}
