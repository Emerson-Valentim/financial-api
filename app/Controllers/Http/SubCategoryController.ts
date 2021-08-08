// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import SubCategory from 'App/Models/SubCategory'
import SubCategoryValidator from 'App/Validators/SubCategoryValidator'
import { CrudController } from '../BaseController/CrudController'

export default class SubCategoryController extends CrudController< SubCategoryValidator,
typeof SubCategory
> {
  constructor () {
    super(new SubCategoryValidator(), SubCategory)
  }
}
