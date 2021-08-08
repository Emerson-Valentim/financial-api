import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BalanceValidator {
  public countTotal () {
    let createdSchema = schema.create({
      initial_date:  schema.date({format: 'dd/LL/yyyy'}),
      final_date:  schema.date({format: 'dd/LL/yyyy'}),
      category_id: schema.number.optional([rules.exists({table: 'categories', column: 'id'})]),
    })
    return createdSchema
  }
}
