import Category from 'App/Models/Category'
import FinancialRelease from 'App/Models/FinancialRelease'
import SubCategory from 'App/Models/SubCategory'
import test from 'japa'
import supertest from 'supertest'

test.group('FinancialRelease controller', (group) => {
  let validFinancialRelease
  let validCategory
  let validSubCategory

  const createFinancialRelease = ({ sub_category_id, value, release_date, observation }) => {
    return supertest(process.env.BASE_URL)
      .post('/financialrelease/create')
      .send({
        sub_category_id,
        value,
        release_date,
        observation,
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)
  }

  const deleteReport = (id) => {
    return supertest(process.env.BASE_URL)
      .delete(`/financialrelease/deleteById/${id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
  }

  group.before(async () => {
    validCategory = await Category.create({name: 'validCategory'})
    validSubCategory = await SubCategory.create({
      category_id: validCategory.id,
      name: 'validSubCategory',
    })
    validFinancialRelease = {
      sub_category_id: validSubCategory.id,
      value: 10.0,
      release_date: '07/07/2021',
      observation: 'Olá',
    }
  })

  group.afterEach(async () => {
    const financialReleases = (await FinancialRelease.all()).map(async financialRelease => financialRelease.delete())
    await Promise.all(financialReleases)
  })

  test('Should call load and receive 404 because database is empty', async () => {
    await supertest(process.env.BASE_URL)
      .get('/financialrelease/load')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })

  test('Should call create and receive 201', async () => {
    const {body: { id }} = await supertest(process.env.BASE_URL)
      .post('/financialrelease/create')
      .send(validFinancialRelease)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)
    await deleteReport(id)
  })

  test('Should call create and receive 400 because date is not in valid format', async () => {
    await supertest(process.env.BASE_URL)
      .post('/financialrelease/create')
      .send({
        ...validFinancialRelease,
        release_date: '07/13/2021',
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(400)
  })

  test('Should call create and receive 404 because sub_category_id is not in database', async () => {
    await supertest(process.env.BASE_URL)
      .post('/financialrelease/create')
      .send({
        ...validFinancialRelease,
        sub_category_id: 0,
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })

  test('Should call load and receive 200', async (assert) => {
    const { body: model } = await createFinancialRelease(validFinancialRelease)

    const { body: loadAll } = await supertest(process.env.BASE_URL)
      .get('/financialrelease/load')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    const { body: loadById } = await supertest(process.env.BASE_URL)
      .get(`/financialrelease/load/${model.id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.isAtLeast(loadAll.length, 1)
    assert.equal(loadById.id, model.id)
  })

  test('Should call update and receive 200 and update model', async (assert) => {
    const { body: model } = await supertest(process.env.BASE_URL)
      .post('/financialrelease/create')
      .send(validFinancialRelease)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)

    const { body: updatedModel } = await supertest(process.env.BASE_URL)
      .put(`/financialrelease/updateById/${model.id}`)
      .send({value: -10.01})
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(updatedModel.value, -10.01)
    assert.notEqual(updatedModel.value, validFinancialRelease.value)
  })

  test('Should call deleteById and receive 200', async (assert) => {
    const { body: model } = await createFinancialRelease(validFinancialRelease)

    const { body: deleteById } = await supertest(process.env.BASE_URL)
      .delete(`/financialrelease/deleteById/${model.id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(deleteById.message, `Id: ${model.id} Deleted.`)
  })
})
