import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import ValidationException from 'App/Exceptions/ValidationException'

export interface BaseValidator {
  createValidation()
  findByIdValidation()
  updateByIdValidation()
  deleteByIdValidation()
}

export abstract class BaseController<Validator extends BaseValidator, Model extends LucidModel> {
  constructor (public readonly validator: Validator, public readonly model: Model) {}

  public async create ({ request, response }: HttpContextContract) {
    const data = await this.validate(request, 'createValidation')
    try {
      const model = await this.model.create(data)
      return response.created(model)
    } catch (error) {
      throw error
    }
  }

  public async deleteById ({ request, response }: HttpContextContract) {
    const data = await this.validate(request, 'findByIdValidation')
    try {
      const model = await this.model.findOrFail(data.id)
      await model.delete()
      return response.ok({ message: `Id: ${model.$primaryKeyValue} Deleted.` })
    } catch (error) {
      throw error
    }
  }

  public async load ({ request, response }: HttpContextContract) {
    const { id } = await this.validate(request, 'findByIdValidation')
    try {
      const model = id ? await this.model.findOrFail(id) : await this.model.all()
      return response.ok(model)
    } catch (error) {
      throw error
    }
  }

  public async updateById ({ request, response }: HttpContextContract) {
    const { id, ...data } = await this.validate(request, 'updateByIdValidation')
    try {
      const model = await this.model.findOrFail(id)

      model.merge(data)

      await model.save()
      return response.ok(model)
    } catch (error) {
      throw error
    }
  }

  protected validate (request, validatorMethod: string) {
    try {
      const data = request.validate({schema: this.validator[validatorMethod]()})
      return data
    } catch (error) {
      throw new ValidationException(error)
    }
  }
}
