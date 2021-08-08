import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { BaseCrudValidator } from 'App/Controllers/BaseController/CrudController'

export default class FinancialReleaseValidator implements BaseCrudValidator {
  public createValidation () {
    let createdSchema = schema.create({
      value: schema.number([rules.notIn([0])]),
      release_date: schema.date({format: 'dd/LL/yyyy'}),
      sub_category_id: schema.number([rules.exists({ table: 'sub_categories', column: 'id' })]),
      observation: schema.string(),
    })
    return createdSchema
  }

  public filterValidation () {
    let createdSchema = schema.create({
      sub_category_id: schema.number.optional([rules.exists({table: 'sub_categories', column: 'id'})]),
      release_date: schema.date.optional({
        format: 'dd/LL/yyyy',
      },
      [rules.exists({table: 'financial_releases', column: 'release_date'})]),
    })

    return createdSchema
  }

  public updateByIdValidation () {
    const createdSchema = schema.create({
      id: schema.number([rules.exists({table: 'financial_releases', column: 'id'})]),
      value: schema.number.optional([rules.notIn([0])]),
      release_date: schema.date.optional(),
      sub_category_id: schema.number.optional([rules.exists({ table: 'sub_categories', column: 'id' })]),
      observation: schema.string.optional(),
    })
    return createdSchema
  }

  public deleteByIdValidation () {
    const createdSchema = schema.create({
      id: schema.number([rules.exists({table: 'financial_releases', column: 'id'})]),
    })
    return createdSchema
  }
}
