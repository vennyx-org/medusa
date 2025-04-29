import { Migration } from "@mikro-orm/migrations"

export class Migration20250326151602 extends Migration {
  override async up(): Promise<void> {
    this.addSql(
      `alter table if exists "cart_line_item_tax_line" add column if not exists "is_compound" boolean not null default false;`
    )
  }

  override async down(): Promise<void> {
    this.addSql(
      `alter table if exists "cart_line_item_tax_line" drop column if exists "is_compound";`
    )
  }
}
