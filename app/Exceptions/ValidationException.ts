import { Exception } from '@adonisjs/core/build/standalone'
import HttpException from './HttpException'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new ValidationException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/

type ValidateError = {
  rule: string
  field: string
  message: string
}

export default class ValidationException extends Exception {
  constructor (message, status) {
    super(message, status)
  }

  private static verifyExistRule (errorsArray: Array<ValidateError>): string {
    for (let item of errorsArray) {
      if (item.rule === 'exists') {
        return item.field
      }
    }
    return ''
  }

  private static joinInvalidParameters (errorsArray: Array<ValidateError>): string {
    let invalidParameters = errorsArray.map((element) => element.field)
    return invalidParameters.join(', ')
  }

  public static handleValidationFailure (error: any) {
    const missingParameterOnDatabase = this.verifyExistRule(error.messages?.errors)
    if (missingParameterOnDatabase) {
      return {
        status: 404,
        message: `Provided ${missingParameterOnDatabase} parameter not exists on database`,
      }
    }
    const invalidParams = this.joinInvalidParameters(error.messages?.errors)
    if (invalidParams && !missingParameterOnDatabase) {
      return {
        status: 400,
        message: `Invalid parameters provided: ${invalidParams}`,
      }
    }
    return {
      status:400,
      message: 'Invalid parameters',
    }
  }

  public async handle (error: this) {
    throw new HttpException(error.message, error.status)
  }
}
