import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { BaseCrudValidator } from 'App/Controllers/BaseController/CrudController'

export default class SubCategoryValidator implements BaseCrudValidator {
  public createValidation () {
    let createdSchema = schema.create({
      category_id: schema.number([rules.exists({ table: 'categories', column: 'id' })]),
      name: schema.string(),
    })
    return createdSchema
  }

  public filterValidation () {
    let createdSchema = schema.create({
      id: schema.number.optional([rules.exists({table: 'sub_categories', column: 'id'})]),
      name: schema.string.optional({ trim:true },[rules.exists({table: 'sub_categories', column: 'name'})]),
    })
    return createdSchema
  }

  public updateByIdValidation () {
    const createdSchema = schema.create({
      id: schema.number([rules.exists({table: 'sub_categories', column: 'id'})]),
      name: schema.string.optional(),
      category_id: schema.number.optional([rules.exists({ table: 'categories', column: 'id' })]),
    })
    return createdSchema
  }

  public deleteByIdValidation () {
    const createdSchema = schema.create({
      id: schema.number([rules.exists({table: 'sub_categories', column: 'id'})]),
    })
    return createdSchema
  }
}
