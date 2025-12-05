import { Migration } from '@mikro-orm/migrations';

export class Migration20250519081137 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "order_line_item_tax_line" add column if not exists "is_compound" boolean null;');

    this.addSql('alter table if exists "order_shipping_method_tax_line" add column if not exists "is_compound" boolean null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "order_line_item_tax_line" drop column if exists "is_compound";');

    this.addSql('alter table if exists "order_shipping_method_tax_line" drop column if exists "is_compound";');
  }

}
