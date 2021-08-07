import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import SubCategory from './SubCategory'

export default class FinancialRelease extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public value: number

  @column()
  public release_date: DateTime

  @column()
  public sub_category_id: number

  @column()
  public observation: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => SubCategory, {
    foreignKey: 'sub_category_id',
  })
  public subCategory: BelongsTo<typeof SubCategory>
}
