import Category from 'App/Models/Category'
import SubCategory from 'App/Models/SubCategory'
import test from 'japa'
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

  test('Should call balance count total and receive 400 because category_id is missing', async () => {
    await supertest(process.env.BASE_URL)
      .get('/balance/countTotal')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(400)
  })

  test('Should call balance count total and receive 200', async (assert) => {
    const { body: balance } = await supertest(process.env.BASE_URL)
      .get(`/balance/countTotal?category_id=${validCategory.id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(balance.categoria.id_categoria, validCategory.id)
    assert.equal(balance.receita, 0)
    assert.equal(balance.despesa, 0)
    assert.equal(balance.saldo, 0)
  })
})
