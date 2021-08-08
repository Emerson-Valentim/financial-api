import Category from 'App/Models/Category'
import FinancialRelease from 'App/Models/FinancialRelease'
import SubCategory from 'App/Models/SubCategory'
import test from 'japa'
import { DateTime } from 'luxon'
import supertest from 'supertest'

test.group('Balance Controller', (group) => {
  let validCategory
  let validSubCategory

  group.before(async () => {
    validCategory = await Category.create({name: 'validCategory'})
    validSubCategory = await SubCategory.create({
      category_id: validCategory.id,
      name: 'validSubCategory',
    })
  })

  group.afterEach(async () => {
    const financialReleases = (await FinancialRelease.all()).map(async financialRelease => financialRelease.delete())
    await Promise.all(financialReleases)
  })

  test('Should call balance count total without data and receive 400', async () => {
    await supertest(process.env.BASE_URL)
      .get('/balance/countTotal')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(400)
  })

  test('Should call balance count total without data and receive 400', async (assert) => {
    const { body: balance } = await supertest(process.env.BASE_URL)
      .get('/balance/countTotal?initial_date=01/01/2021&final_date=01/01/2021')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.doesNotHaveAnyKeys(balance, ['categoria'])
    assert.equal(balance.receita, 0)
    assert.equal(balance.despesa, 0)
    assert.equal(balance.saldo, 0)
  })

  test('Should call balance count total and receive 200 with values', async (assert) => {
    FinancialRelease.createMany([
      {
        value: 100.00,
        sub_category_id: validSubCategory.id,
        release_date: DateTime.fromFormat('01/01/2021', 'dd/LL/yyyy'),
      },
      {
        value: -100.01,
        sub_category_id: validSubCategory.id,
        release_date: DateTime.fromFormat('01/01/2021', 'dd/LL/yyyy'),
      },
      {
        value: 1.00,
        sub_category_id: validSubCategory.id,
        release_date: DateTime.fromFormat('01/01/2021', 'dd/LL/yyyy'),
      },
      {
        value: 1000.00,
        sub_category_id: validSubCategory.id,
        release_date: DateTime.fromFormat('02/01/2021', 'dd/LL/yyyy'),
      },
    ])

    const { body: balance1 } = await supertest(process.env.BASE_URL)
      .get(`/balance/countTotal?category_id=${validCategory.id}&initial_date=01/01/2021&final_date=01/01/2021`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.hasAnyKeys(balance1, ['categoria'])
    assert.equal(balance1.categoria.id_categoria, validCategory.id)
    assert.equal(balance1.receita, 101)
    assert.equal(balance1.despesa, 100.01)
    assert.equal(balance1.saldo, .99)

    const { body: balance2 } = await supertest(process.env.BASE_URL)
      .get(`/balance/countTotal?category_id=${validCategory.id}&initial_date=01/01/2021&final_date=02/01/2021`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(balance2.receita, 1101)
    assert.equal(balance2.despesa, 100.01)
    assert.equal(balance2.saldo, 1000.99)
  })
})
