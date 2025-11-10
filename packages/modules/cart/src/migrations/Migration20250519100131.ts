import { Migration } from '@mikro-orm/migrations';

export class Migration20250519100131 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "cart_line_item_tax_line" add column if not exists "is_compound" boolean not null default false;');

    this.addSql('alter table if exists "cart_shipping_method_tax_line" add column if not exists "is_compound" boolean not null default false;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "cart_line_item_tax_line" drop column if exists "is_compound";');

    this.addSql('alter table if exists "cart_shipping_method_tax_line" drop column if exists "is_compound";');
  }

}
