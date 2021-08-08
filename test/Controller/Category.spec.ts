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

  test('Should call load and receive 404 because database is empty', async () => {
    await supertest(process.env.BASE_URL)
      .get('/category/load')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })

  test('Should call load and receive 404 because id not valid', async () => {
    await supertest(process.env.BASE_URL)
      .get('/category/load/0')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })

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
    const invalidCategory = {
      invalidField: 'Category 1',
    }

    await supertest(process.env.BASE_URL)
      .post('/category/create')
      .send(invalidCategory)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(400)
  })

  test('Should call update and receive 200 and update model', async (assert) => {
    const validCategory = {
      name: 'Category 1',
    }

    const { body: model } = await supertest(process.env.BASE_URL)
      .post('/category/create')
      .send(validCategory)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)

    const { body: updatedModel } = await supertest(process.env.BASE_URL)
      .put(`/category/updateById/${model.id}`)
      .send({name: 'UpdatedModel'})
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(updatedModel.name, 'UpdatedModel')
    assert.notEqual(updatedModel.name, validCategory.name)
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

  test('Should call deleteById and receive 200', async (assert) => {
    const { body: model } = await createCategory({name: 'DeleteTest'})

    const { body: deleteById } = await supertest(process.env.BASE_URL)
      .delete(`/category/deleteById/${model.id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(deleteById.message, `Id: ${model.id} Deleted.`)
  })
})
