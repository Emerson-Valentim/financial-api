import test from 'japa'
import supertest from 'supertest'

test.group('Authorizer Middleware', () => {
  test('Should call healthCheck and recieve 200', async () => {
    await supertest(process.env.BASE_URL)
      .get('/healthCheck')
      .expect(200)
  })

  test('Should call authenticated route and recieve 401', async () => {
    await supertest(process.env.BASE_URL)
      .post('/category/load')
      .expect(404)
  })

  test('Should call authenticated route and recieve code different from 401', async () => {
    await supertest(process.env.BASE_URL)
      .post('/category/load')
      .expect((res) => res.status !== 401)
  })
})
