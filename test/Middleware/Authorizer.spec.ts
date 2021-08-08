import test from 'japa'
import supertest from 'supertest'

test.group('Authorizer Middleware', () => {
  test('Should call healthCheck and receive 200', async () => {
    await supertest(process.env.BASE_URL)
      .get('/healthCheck')
      .expect(200)
  })

  test('Should call authenticated route and receive 401', async () => {
    await supertest(process.env.BASE_URL)
      .get('/category/load')
      .expect(401)
  })

  test('Should call authenticated route and receive code different from 401', async () => {
    await supertest(process.env.BASE_URL)
      .get('/category/load')
      .set('x-api-key', process.env.HEADER_API_KEY)
      .expect((res) => res.status !== 401)
  })
})
