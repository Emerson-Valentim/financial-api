import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpException from 'App/Exceptions/HttpException'

export default class Authorizer {
  public async handle ({ request }: HttpContextContract, next: () => Promise<void>) {
    if(!this.isAuthenticated(request)) {
      throw new HttpException('You cant access this route, verify your request headers', 401)
    }

    await next()
  }

  private isAuthenticated (request) {
    const { 'x-api-key': xApiKey} = request.headers()
    return xApiKey !== Env.get('HEADER_API_KEY') && request.url() !== '/healthCheck'
  }
}
