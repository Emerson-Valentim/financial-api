// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import FinancialReleaseValidator from 'App/Validators/FinancialReleaseValidator'
import FinancialRelease from 'App/Models/FinancialRelease'
import { BaseController } from '../BaseController/BaseCrudController'

export default class FinancialReleasesController extends BaseController< FinancialReleaseValidator,
typeof FinancialRelease
> {
  constructor () {
    super(new FinancialReleaseValidator(), FinancialRelease)
  }
}
