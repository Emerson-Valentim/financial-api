import { Exception } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import HttpLogger from 'App/Middleware/HttpLogger'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new HttpException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class HttpException extends Exception {
  constructor (message: string, status: number) {
    super(message, status)
  }

  public async handle (error: this, ctx: HttpContextContract) {
    ctx.response
      .status(error.status)
      .send({ error: error.message })
    HttpLogger.generateReponseLog(ctx)
  }
}
