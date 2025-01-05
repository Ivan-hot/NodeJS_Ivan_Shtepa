import { MigrationInterface, QueryRunner } from "typeorm";

export class CREATEALL1731506413835 implements MigrationInterface {
    name = 'CREATEALL1731506413835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "session_name" character varying(100) NOT NULL, "is_private" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying(50) NOT NULL, "password" character varying(100) NOT NULL, "nick_name" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" SERIAL NOT NULL, "message_text" text NOT NULL, "is_public" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "session_id" uuid, "user_id" integer, "receiver_id" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_sessions_session" ("user_id" integer NOT NULL, "session_id" uuid NOT NULL, CONSTRAINT "PK_546d01de0a219fc5339ee265b0a" PRIMARY KEY ("user_id", "session_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9da9fc22b5d2ac687514475c2c" ON "user_sessions_session" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_1870df7d1c152531e4553a8a81" ON "user_sessions_session" ("session_id") `);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_6152e2204a4c6f3c7cef43529a1" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_54ce30caeb3f33d68398ea10376" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_f4da40532b0102d51beb220f16a" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_sessions_session" ADD CONSTRAINT "FK_9da9fc22b5d2ac687514475c2cd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_sessions_session" ADD CONSTRAINT "FK_1870df7d1c152531e4553a8a811" FOREIGN KEY ("session_id") REFERENCES "session"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_sessions_session" DROP CONSTRAINT "FK_1870df7d1c152531e4553a8a811"`);
        await queryRunner.query(`ALTER TABLE "user_sessions_session" DROP CONSTRAINT "FK_9da9fc22b5d2ac687514475c2cd"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_f4da40532b0102d51beb220f16a"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_54ce30caeb3f33d68398ea10376"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_6152e2204a4c6f3c7cef43529a1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1870df7d1c152531e4553a8a81"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9da9fc22b5d2ac687514475c2c"`);
        await queryRunner.query(`DROP TABLE "user_sessions_session"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
