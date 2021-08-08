import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class BalanceValidator {
  public countTotal () {
    let createdSchema = schema.create({
      initial_date:  schema.date.optional({format: 'dd/LL/yyyy'}, [rules.requiredIfExists('final_date')]),
      final_date:  schema.date.optional({format: 'dd/LL/yyyy'}, [rules.requiredIfExists('initial_date')]),
      category_id: schema.number([rules.exists({table: 'categories', column: 'id'})]),
    })
    return createdSchema
  }
}
