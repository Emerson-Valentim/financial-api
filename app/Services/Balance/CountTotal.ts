import Category from 'App/Models/Category'
import FinancialRelease from 'App/Models/FinancialRelease'

interface CountInterface {
  receita: string
  despesa: number
  saldo: number
}

type InputData = {
  category_id?: number
  initial_date?
  final_date?
}

export abstract class CountTotal {
  public static async handle ({
    category_id: categoryId,
    initial_date: initialDate,
    final_date: finalDate}: InputData) {
    let categoryModel
    const query = this.queryFinancialRelease()

    if(initialDate && finalDate) {
      query.whereBetween('release_date', [initialDate, finalDate])
    }

    if(categoryId) {
      query.where('sub_categories.category_id', categoryId)
      categoryModel = await Category.findOrFail(categoryId)
    }

    const mappedResult = await this.toObject(query)

    if(categoryModel) {
      return {
        categoria: {
          id_categoria: categoryModel.id,
          nome: categoryModel.name,
        },
        ...mappedResult,
      }
    }

    return mappedResult
  }

  private static queryFinancialRelease () {
    return FinancialRelease.query()
      .innerJoin('sub_categories', 'financial_releases.sub_category_id', 'sub_categories.id')
      .select('financial_releases.value')
  }

  private static async toObject (query): Promise<CountInterface> {
    return (await query).reduce((mappedReturn: CountInterface, {$original: { value }}) => {
      value > 0 ?
        mappedReturn.receita += value:
        mappedReturn.despesa += value * -1
      mappedReturn.saldo += value
      return mappedReturn
    }, {
      receita:0,
      despesa:0,
      saldo: 0,
    })
  }
}
