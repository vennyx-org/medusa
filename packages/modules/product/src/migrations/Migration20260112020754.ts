import { Migration } from '@mikro-orm/migrations';

export class Migration20260112020754 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "product" add column if not exists "is_tax_inclusive" boolean null;`
    );
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "product" drop column if exists "is_tax_inclusive";`
    );
  }
}
