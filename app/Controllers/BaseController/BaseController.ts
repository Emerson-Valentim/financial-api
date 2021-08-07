import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { LucidModel } from '@ioc:Adonis/Lucid/Orm'
import HttpException from 'App/Exceptions/HttpException'
import ValidationException from 'App/Exceptions/ValidationException'

export interface BaseValidator {
  createValidation()
  findByIdValidation()
  updateByIdValidation()
  deleteByIdValidation()
}

type ValidateError = {
  rule: string
  field: string
  message: string
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
      let model

      if(id) {
        model = await this.model.findOrFail(id)
        return response.ok(model)
      } else {
        model = await this.model.all()
        if(model.length) {
          return response.ok(model)
        }
        throw new HttpException('No registry found on database', 404)
      }
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

  protected async validate (request, validatorMethod: string) {
    try {
      const data = await request.validate({schema: this.validator[validatorMethod]()})
      return data
    } catch (error) {
      console.log(error)
      const { message, status } = ValidationException.handleValidationFailure(error)
      throw new HttpException(message, status)
    }
  }

  private verifyExistRule (errorsArray: Array<ValidateError>): string {
    for (let item of errorsArray) {
      if (item.rule === 'exists') {
        return item.field
      }
    }
    return ''
  }

  private joinInvalidParameters (errorsArray: Array<ValidateError>): string {
    let invalidParameters = errorsArray.map((element) => element.field)
    return invalidParameters.join(', ')
  }

  public handleValidationFailure (error: any) {
    const missingParameterOnDatabase = this.verifyExistRule(error.messages?.errors)
    if (missingParameterOnDatabase) {
      return {
        status: 404,
        message: `Provided ${missingParameterOnDatabase} parameter not exists on database`,
      }
    }
    const invalidParams = this.joinInvalidParameters(error.messages?.errors)
    if (invalidParams && !missingParameterOnDatabase) {
      return {
        status: 400,
        message: `Invalid parameters provided: ${invalidParams}`,
      }
    }
    return {
      status:400,
      message: 'Invalid parameters',
    }
  }
}
