import { MigrationInterface, QueryRunner } from 'typeorm';

// Adds firstName and lastName columns to the users table.
// Uses IF NOT EXISTS so the migration is safe to run even if synchronize:true
// previously created the columns — idempotent by design.
export class AddNameToUsers1741564800001 implements MigrationInterface {
  name = 'AddNameToUsers1741564800001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "firstName" CHARACTER VARYING(100) NOT NULL DEFAULT '',
        ADD COLUMN IF NOT EXISTS "lastName"  CHARACTER VARYING(100) NOT NULL DEFAULT ''
    `);

    // Drop temporary defaults — new rows must always provide names explicitly
    await queryRunner.query(`
      ALTER TABLE "users"
        ALTER COLUMN "firstName" DROP DEFAULT,
        ALTER COLUMN "lastName"  DROP DEFAULT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "firstName",
        DROP COLUMN IF EXISTS "lastName"
    `);
  }
}
