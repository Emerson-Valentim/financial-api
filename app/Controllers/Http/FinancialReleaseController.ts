// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import FinancialReleaseValidator from 'App/Validators/FinancialReleaseValidator'
import FinancialRelease from 'App/Models/FinancialRelease'
import { CrudController } from '../BaseController/CrudController'

export default class FinancialReleasesController extends CrudController< FinancialReleaseValidator,
typeof FinancialRelease
> {
  constructor () {
    super(new FinancialReleaseValidator(), FinancialRelease)
  }
}
