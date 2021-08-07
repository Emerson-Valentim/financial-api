// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import SubCategory from 'App/Models/SubCategory'
import SubCategoryValidator from 'App/Validators/SubCategoryValidator'
import { BaseController } from '../BaseController/BaseCrudController'

export default class SubCategoryController extends BaseController< SubCategoryValidator,
typeof SubCategory
> {
  constructor () {
    super(new SubCategoryValidator(), SubCategory)
  }
}
