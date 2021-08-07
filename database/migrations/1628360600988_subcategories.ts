import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Subcategories extends BaseSchema {
  protected tableName = 'sub_categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments('id')
      table
        .string('name')
        .notNullable()
      table
        .integer('category_id')
        .references('categories.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE')
        .notNullable()
      table
        .timestamp('created_at', { useTz: true })
      table
        .timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
