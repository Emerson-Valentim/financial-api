import Category from 'App/Models/Category'
import CategoryValidator from 'App/Validators/CategoryValidator'
import { CrudController } from '../BaseController/CrudController'

export default class CategoryController extends CrudController< CategoryValidator,
typeof Category
> {
  constructor () {
    super(new CategoryValidator(), Category)
  }
}
