import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { BaseCrudValidator } from 'App/Controllers/BaseController/CrudController'

export default class CategoryValidator implements BaseCrudValidator {
  public createValidation () {
    let createdSchema = schema.create({
      name: schema.string(),
    })
    return createdSchema
  }

  public findByIdValidation () {
    let createdSchema = schema.create({
      id: schema.number.optional([rules.exists({table: 'categories', column: 'id'})]),
    })

    return createdSchema
  }

  public updateByIdValidation () {
    const createdSchema = schema.create({
      id: schema.number([rules.exists({table: 'categories', column: 'id'})]),
      name: schema.string.optional(),
    })
    return createdSchema
  }

  public deleteByIdValidation () {
    const createdSchema = schema.create({
      id: schema.number([rules.exists({table: 'categories', column: 'id'})]),
    })
    return createdSchema
  }
}
