import Category from 'App/Models/Category'
import SubCategory from 'App/Models/SubCategory'
import test from 'japa'
import supertest from 'supertest'

test.group('SubCategory controller', (group) => {
  let validCategory

  const createSubCategory = ({ name }) => {
    return supertest(process.env.BASE_URL)
      .post('/subcategory/create')
      .send({
        category_id: validCategory.id,
        name: name,
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)
  }

  group.before(async () => {
    validCategory = await Category.create({name: 'validCategory'})
  })

  group.beforeEach(async () => {
    const SubCategories = (await SubCategory.all()).map(async subCategory => subCategory.delete())
    await Promise.all(SubCategories)
  })

  test('Should call load and receive 404 because database is empty', async () => {
    await supertest(process.env.BASE_URL)
      .get('/subcategory/load')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })

  test('Should call load and receive 404 because database is empty', async () => {
    await supertest(process.env.BASE_URL)
      .get('/subcategory/load/0')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })

  test('Should call create and receive 201', async () => {
    await supertest(process.env.BASE_URL)
      .post('/subcategory/create')
      .send({
        category_id: validCategory.id,
        name: 'validSubCategory',
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)
  })

  test('Should call create and receive 400 because name is not provided', async () => {
    await supertest(process.env.BASE_URL)
      .post('/subcategory/create')
      .send({
        category_id: validCategory.id,
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(400)
  })

  test('Should call create and receive 404 because category_id is not on database', async () => {
    await supertest(process.env.BASE_URL)
      .post('/subcategory/create')
      .send({
        category_id: 0,
        name: 'validSubCategoryName',
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })

  test('Should call load passing id and receive 200', async (assert) => {
    const { body: model } = await createSubCategory({name: 'LoadTest'})

    const { body: loadAll } = await supertest(process.env.BASE_URL)
      .get('/subcategory/load')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    const { body: loadById } = await supertest(process.env.BASE_URL)
      .get(`/subcategory/load/${model.id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.isAtLeast(loadAll.length, 1)
    assert.equal(loadById.id, model.id)
  })

  test('Should call load passing name and receive 200', async (assert) => {
    const { body: model } = await createSubCategory({name: 'LoadTest'})

    const { body: loadById } = await supertest(process.env.BASE_URL)
      .get(`/subcategory/load?name=${model.name}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(loadById.id, model.id)
  })

  test('Should call update and receive 200 and update model', async (assert) => {
    const validSubCategory = {
      name: 'Sub Category 1',
      category_id: validCategory.id,
    }

    const { body: model } = await supertest(process.env.BASE_URL)
      .post('/subcategory/create')
      .send(validSubCategory)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)

    const { body: updatedModel } = await supertest(process.env.BASE_URL)
      .put(`/subcategory/updateById/${model.id}`)
      .send({name: 'Updated Sub Category'})
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(updatedModel.name, 'Updated Sub Category')
    assert.notEqual(updatedModel.name, validSubCategory.name)
  })

  test('Should call deleteById and receive 200', async (assert) => {
    const { body: model } = await createSubCategory({name: 'DeleteTest'})

    const { body: deleteById } = await supertest(process.env.BASE_URL)
      .delete(`/subcategory/deleteById/${model.id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    assert.equal(deleteById.message, `Id: ${model.id} Deleted.`)
  })
})
