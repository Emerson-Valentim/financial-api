import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FinancialReleases extends BaseSchema {
  protected tableName = 'financial_releases'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .float('value')
        .notNullable()
      table
        .date('release_date')
        .notNullable()
      table
        .string('observation')
      table
        .integer('sub_category_id')
        .references('sub_categories.id')
        .notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
