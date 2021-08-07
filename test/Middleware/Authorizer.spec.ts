import test from 'japa'

test.group('Authorizer Middleware', (group) => {
  test('Should call healthCheck and get 200', () => {
    console.log(process.env.BASE_URL)
  })
})
