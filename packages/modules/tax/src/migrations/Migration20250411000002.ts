import { Migration } from "@mikro-orm/migrations"

export class Migration20240800000002 extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      ALTER TABLE "tax_rate" 
      ADD COLUMN IF NOT EXISTS "is_compound" BOOLEAN NOT NULL DEFAULT FALSE
    `)
  }

  async down(): Promise<void> {
    this.addSql(`
      ALTER TABLE "tax_rate" 
      DROP COLUMN IF EXISTS "is_compound"
    `)
  }
} 
