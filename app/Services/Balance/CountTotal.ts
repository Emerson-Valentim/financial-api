import Category from 'App/Models/Category'
import FinancialRelease from 'App/Models/FinancialRelease'

interface CountInterface {
  categoria: {
    id_categoria: number
    nome: string
  }
}

type InputData = {
  category_id: number
  initial_date
  final_date
}

export abstract class CountTotal {
  public static async handle ({
    category_id: categoryId,
    initial_date: initialDate,
    final_date: finalDate}: InputData) {
    const category = await Category.findOrFail(categoryId)

    const query = this.queryFinancialRelease(categoryId)

    if(initialDate && finalDate) {
      query.whereBetween('release_date', [initialDate, finalDate])
    }

    const mappedResult = await this.toObject(category, query)

    return mappedResult
  }

  private static queryFinancialRelease (categoryId) {
    return FinancialRelease.query()
      .innerJoin('sub_categories', 'financial_releases.sub_category_id', 'sub_categories.id')
      .where('sub_categories.category_id', categoryId)
      .groupBy('sub_categories.id')
      .select([
        'sub_categories.id as sub_category_id',
        'sub_categories.name as sub_category_name',
      ])
      .count('*')
  }

  private static async toObject (category, query): Promise<CountInterface> {
    return (await query).reduce((mappedReturn: CountInterface, {$extras}) => {
      if(!mappedReturn[$extras.sub_category_name]) {
        mappedReturn[$extras.sub_category_name] = 0
      }
      mappedReturn[$extras.sub_category_name] += +$extras.count
      return mappedReturn
    }, {categoria: {id_categoria: category.id,nome: category.name}})
  }
}
