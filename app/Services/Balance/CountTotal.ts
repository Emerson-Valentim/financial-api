import Category from 'App/Models/Category'
import FinancialRelease from 'App/Models/FinancialRelease'

interface CountInterface {
  categoria: {
    id_categoria: number
    nome: string
  },
  receita: string
  despesa: number
  saldo: number
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
      .select('financial_releases.value')
  }

  private static async toObject (category, query): Promise<CountInterface> {
    return (await query).reduce((mappedReturn: CountInterface, {$original: { value }}) => {
      value > 0 ?
        mappedReturn.receita += value:
        mappedReturn.despesa += value * -1
      mappedReturn.saldo += value
      return mappedReturn
    }, {
      categoria: {
        id_categoria: category.id,
        nome: category.name,
      },
      receita:0,
      despesa:0,
      saldo: 0,
    })
  }
}
