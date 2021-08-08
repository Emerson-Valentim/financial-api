import test from 'japa'
import supertest from 'supertest'

test.group('Category controller', () => {
  const createCategory = ({ name }) => {
    return supertest(process.env.BASE_URL)
      .post('/category/create')
      .send({name})
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)
  }

  test('Should call create and receive 201', async () => {
    const validCategory = {
      name: 'Category 1',
    }

    await supertest(process.env.BASE_URL)
      .post('/category/create')
      .send(validCategory)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)
  })

  test('Should call create and receive 400', async () => {
    const validCategory = {
      invalidField: 'Category 1',
    }

    await supertest(process.env.BASE_URL)
      .post('/category/create')
      .send(validCategory)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(400)
  })

  test('Should call load and receive 200', async (assert) => {
    const { body: model } = await createCategory({name: 'LoadTest'})

    const { body: loadAll } = await supertest(process.env.BASE_URL)
      .get('/category/load')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    const { body: loadById } = await supertest(process.env.BASE_URL)
      .get(`/category/load/${model.id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.isAtLeast(loadAll.length, 1)
    assert.equal(loadById.id, model.id)
  })
})
