// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import FinancialReleaseValidator from 'App/Validators/FinancialReleaseValidator'
import FinancialRelease from 'App/Models/FinancialRelease'
import { CrudController } from '../BaseController/CrudController'
import HttpException from 'App/Exceptions/HttpException'
import BaseValidator from 'App/Validators/BaseValidator'

export default class FinancialReleasesController extends CrudController< FinancialReleaseValidator,
typeof FinancialRelease
> {
  constructor () {
    super(new FinancialReleaseValidator(), FinancialRelease)
  }

  public async load ({ request, response }: HttpContextContract) {
    const {
      initial_date: initialDate,
      final_date: finalDate,
      sub_category_id: subCategoryId,
    } = await BaseValidator.validate(request, 'filterValidation', this.validator)
    try {
      const query = this.model.query().where('sub_category_id', subCategoryId)
      if(initialDate || finalDate) {
        query.whereBetween('release_date', [initialDate, finalDate])
      }
      const model = await query
      if(model.length) {
        return response.ok(model)
      }
      throw new HttpException('No registry found in database', 404)
    } catch (error) {
      throw error
    }
  }
}
