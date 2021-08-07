import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Authorizer {
  public async handle ({request, response}: HttpContextContract, next: () => Promise<void>) {
    const xApiKey = request.header('x-api-key')
    if(xApiKey !== Env.get('HEADER_API_KEY')) {
      return response
        .unauthorized({message: 'You cant access this route, verify your request headers'})
    }
    await next()
  }
}
