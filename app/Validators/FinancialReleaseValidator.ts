import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { BaseValidator } from 'App/Controllers/BaseController/BaseController'

export default class FinancialReleaseValidator implements BaseValidator {
  public createValidation () {
    let createdSchema = schema.create({
      value: schema.number([rules.notIn([0])]),
      release_date: schema.date({format: 'dd/LL/yyyy'}),
      sub_category_id: schema.number([rules.exists({ table: 'sub_categories', column: 'id' })]),
      observation: schema.string(),
    })
    return createdSchema
  }

  public findByIdValidation () {
    let createdSchema = schema.create({
      id: schema.number.optional([rules.exists({table: 'financial_releases', column: 'id'})]),
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
