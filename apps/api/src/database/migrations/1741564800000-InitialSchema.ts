import { MigrationInterface, QueryRunner } from 'typeorm';

// Initial schema migration.
// Creates: users table, refresh_tokens table, role enum, FK + index.
// Uses gen_random_uuid() — built into PostgreSQL 13+ (no extension required).
export class InitialSchema1741564800000 implements MigrationInterface {
  name = 'InitialSchema1741564800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── Role enum ────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')
    `);

    // ── Users table ──────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"             UUID                          NOT NULL DEFAULT gen_random_uuid(),
        "email"          CHARACTER VARYING(255)        NOT NULL,
        "password"       CHARACTER VARYING             NOT NULL,
        "role"           "public"."users_role_enum"    NOT NULL DEFAULT 'user',
        "failedAttempts" INTEGER                       NOT NULL DEFAULT 0,
        "lockedUntil"    TIMESTAMP WITH TIME ZONE,
        "createdAt"      TIMESTAMP                     NOT NULL DEFAULT now(),
        "updatedAt"      TIMESTAMP                     NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email"  UNIQUE ("email"),
        CONSTRAINT "PK_users"        PRIMARY KEY ("id")
      )
    `);

    // ── Refresh tokens table ─────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "refresh_tokens" (
        "id"         UUID                     NOT NULL DEFAULT gen_random_uuid(),
        "tokenHash"  CHARACTER VARYING        NOT NULL,
        "userId"     UUID                     NOT NULL,
        "expiresAt"  TIMESTAMP WITH TIME ZONE NOT NULL,
        "revoked"    BOOLEAN                  NOT NULL DEFAULT false,
        "createdAt"  TIMESTAMP                NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_refresh_tokens_tokenHash" UNIQUE ("tokenHash"),
        CONSTRAINT "PK_refresh_tokens"           PRIMARY KEY ("id")
      )
    `);

    // ── Index on tokenHash — used on every refresh/logout lookup ─────────────
    await queryRunner.query(`
      CREATE INDEX "IDX_refresh_tokens_tokenHash"
      ON "refresh_tokens" ("tokenHash")
    `);

    // ── Foreign key: refresh_tokens.userId → users.id ────────────────────────
    // ON DELETE CASCADE: deleting a user removes all their refresh tokens.
    await queryRunner.query(`
      ALTER TABLE "refresh_tokens"
      ADD CONSTRAINT "FK_refresh_tokens_userId"
      FOREIGN KEY ("userId")
      REFERENCES "users" ("id")
      ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_refresh_tokens_userId"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_refresh_tokens_tokenHash"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
