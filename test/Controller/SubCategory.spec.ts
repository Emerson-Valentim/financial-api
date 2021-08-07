import Category from 'App/Models/Category'
import test from 'japa'
import supertest from 'supertest'

test.group('SubCategory controller', (group) => {
  let validCategory

  group.before(async () => {
    validCategory = await Category.create({name: 'validCategory'})
  })

  test('Should call create and recieve 201', async () => {
    await supertest(process.env.BASE_URL)
      .post('/subcategory/create')
      .send({
        category_id: validCategory.id,
        name: 'validSubCategory',
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)
  })

  test('Should call create and recieve 400 because name is not provided', async () => {
    await supertest(process.env.BASE_URL)
      .post('/subcategory/create')
      .send({
        category_id: validCategory.id,
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(400)
  })

  test('Should call create and recieve 404 because category_id is not on database', async () => {
    await supertest(process.env.BASE_URL)
      .post('/subcategory/create')
      .send({
        category_id: 0,
        name: 'validSubCategoryName',
      })
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })

  test('Should call load 404 because database is empty', async () => {
    await supertest(process.env.BASE_URL)
      .delete(`/category/deleteById/${validCategory.id}`)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(200)

    await supertest(process.env.BASE_URL)
      .get('/subcategory/load')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(404)
  })
})
