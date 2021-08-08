import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ParamsParse {
  public async handle ({request}: HttpContextContract, next: () => Promise<void>) {
    if(this.objectFilled(request.params())) {
      request.updateBody({...request.all(), ...request.params()})
    }
    if(this.objectFilled(request.qs())) {
      request.updateBody({...request.all(), ...request.qs()})
    }
    await next()
  }

  private objectFilled (object) {
    return Object.keys(object).length > 0
  }
}
