import Category from 'App/Models/Category'
import CategoryValidator from 'App/Validators/CategoryValidator'
import { BaseController } from '../BaseController/BaseController'

export default class CategoryController extends BaseController< CategoryValidator,
typeof Category
> {
  constructor () {
    super(new CategoryValidator(), Category)
  }
}
