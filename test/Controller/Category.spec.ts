import test from 'japa'
import supertest from 'supertest'

test.group('Category controller', (group) => {
  test('Should call create and recieve 201', async () => {
    const validCategory = {
      name: 'Category 1',
    }

    await supertest(process.env.BASE_URL)
      .post('/category/create')
      .send(validCategory)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(201)
  })

  test('Should call create and recieve 400', async () => {
    const validCategory = {
      invalidField: 'Category 1',
    }

    await supertest(process.env.BASE_URL)
      .post('/category/create')
      .send(validCategory)
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect(400)
  })
})
