import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ParamsParse {
  public async handle ({request}: HttpContextContract, next: () => Promise<void>) {
    if(this.hasParams(request.params())) {
      request.updateBody({...request.all(), ...request.params()})
    }
    await next()
  }

  private hasParams (object) {
    return Object.keys(object).length > 0
  }
}
