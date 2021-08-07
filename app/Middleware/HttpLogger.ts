import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Logger from '@ioc:Adonis/Core/Logger'

export default class HttpLogger {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {
    await next()
    HttpLogger.generateReponseLog(ctx)
  }

  public static generateReponseLog (ctx: HttpContextContract) {
    const httpInfo = {
      request: {
        id: ctx.request.id(),
        path: ctx.request.url(),
        headers: ctx.request.headers(),
        method: ctx.request.method(),
        body: ctx.request.all(),
        params: ctx.request.params(),
      },
      response: {
        code: ctx.response.response.statusCode,
        body: ctx.response.lazyBody[0],
      },
    }
    Logger.info(httpInfo, 'Completed request')
  }
}
