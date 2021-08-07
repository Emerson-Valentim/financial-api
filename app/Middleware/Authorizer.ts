import Env from '@ioc:Adonis/Core/Env'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpException from 'App/Exceptions/HttpException'

export default class Authorizer {
  public async handle ({ request }: HttpContextContract, next: () => Promise<void>) {
    const xApiKey = request.header('x-api-key')
    if(xApiKey !== Env.get('HEADER_API_KEY')) {
      throw new HttpException('You cant access this route, verify your request headers', 401)
    }
    await next()
  }
}
