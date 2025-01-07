import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEALL1736269356584 implements MigrationInterface {
    name = 'CREATEALL1736269356584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_groups" DROP CONSTRAINT "FK_704b6a5e9219d8ecc1351950ffb"`);
        await queryRunner.query(`ALTER TABLE "user_groups" ALTER COLUMN "session_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_groups" ADD CONSTRAINT "FK_704b6a5e9219d8ecc1351950ffb" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_groups" DROP CONSTRAINT "FK_704b6a5e9219d8ecc1351950ffb"`);
        await queryRunner.query(`ALTER TABLE "user_groups" ALTER COLUMN "session_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_groups" ADD CONSTRAINT "FK_704b6a5e9219d8ecc1351950ffb" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
