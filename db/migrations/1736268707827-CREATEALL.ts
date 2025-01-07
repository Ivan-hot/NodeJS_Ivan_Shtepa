import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEALL1736268707827 implements MigrationInterface {
    name = 'CREATEALL1736268707827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_groups" ("id" SERIAL NOT NULL, "is_creator" boolean NOT NULL DEFAULT false, "user_id" integer, "session_id" uuid, CONSTRAINT "PK_ea7760dc75ee1bf0b09ab9b3289" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_groups" ADD CONSTRAINT "FK_95bf94c61795df25a5154350102" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_groups" ADD CONSTRAINT "FK_704b6a5e9219d8ecc1351950ffb" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_groups" DROP CONSTRAINT "FK_704b6a5e9219d8ecc1351950ffb"`);
        await queryRunner.query(`ALTER TABLE "user_groups" DROP CONSTRAINT "FK_95bf94c61795df25a5154350102"`);
        await queryRunner.query(`DROP TABLE "user_groups"`);
    }

}
