import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import HttpException from 'App/Exceptions/HttpException'
import BaseValidator from 'App/Validators/BaseValidator'

export interface BaseCrudValidator {
  createValidation()
  filterValidation()
  updateByIdValidation()
  deleteByIdValidation()
}

export abstract class CrudController<Validator extends BaseCrudValidator, Model extends LucidModel> {
  constructor (public readonly validator: Validator, public readonly model: Model) {}

  public async create ({ request, response }: HttpContextContract) {
    const data = await BaseValidator.validate(request, 'createValidation', this.validator)
    try {
      const model = await this.model.create(data)
      return response.created(model)
    } catch (error) {
      throw error
    }
  }

  public async deleteById ({ request, response }: HttpContextContract) {
    const data = await BaseValidator.validate(request, 'deleteByIdValidation', this.validator)
    try {
      const model = await this.model.findOrFail(data.id)
      await model.delete()
      return response.ok({ message: `Id: ${model.$primaryKeyValue} Deleted.` })
    } catch (error) {
      throw error
    }
  }

  public async load ({ request, response }: HttpContextContract) {
    const data = await BaseValidator.validate(request, 'filterValidation', this.validator)
    const [[key, value]] = Object.entries(data).length ? Object.entries(data) : [[]]
    try {
      let model
      if(key) {
        model = await this.model.findByOrFail(key, value)
        return response.ok(model)
      } else {
        model = await this.model.all()
        if(model.length) {
          return response.ok(model)
        }
        throw new HttpException('No registry found in database', 404)
      }
    } catch (error) {
      throw error
    }
  }

  public async updateById ({ request, response }: HttpContextContract) {
    const { id, ...data } = await BaseValidator.validate(request, 'updateByIdValidation', this.validator)
    try {
      const model = await this.model.findOrFail(id)

      model.merge(data)

      await model.save()
      return response.ok(model)
    } catch (error) {
      throw error
    }
  }
}
