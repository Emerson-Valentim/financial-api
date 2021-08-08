import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpException from 'App/Exceptions/HttpException'
import { CountTotal } from 'App/Services/Balance/CountTotal'
import BalanceValidator from 'App/Validators/BalanceValidator'
import BaseValidator from 'App/Validators/BaseValidator'

export default class BalancesController {
  constructor (public readonly validator) {
    this.validator = new BalanceValidator()
  }

  public async countTotal ({ request, response }: HttpContextContract) {
    const data = await BaseValidator.validate(request, 'countTotal', this.validator)
    try {
      const mappedResult = await CountTotal.handle(data)

      mappedResult ?
        response.ok(mappedResult) :
        (() => {
          throw new HttpException('No registry found in database', 404)
        })()
    } catch (error) {
      throw error
    }
  }
}
