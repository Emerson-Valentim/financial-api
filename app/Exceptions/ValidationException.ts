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
  constructor (message: string, status: number) {
    super(message, status)
  }

  private verifyExistRule (errorsArray: Array<ValidateError>): string {
    for (let item of errorsArray) {
      if (item.rule === 'exists') {
        return item.field
      }
    }
    return ''
  }

  private joinInvalidParameters (errorsArray: Array<ValidateError>): string {
    let invalidParameters = errorsArray.map((element) => element.field)
    return invalidParameters.join(', ')
  }

  private handleValidationFailure (error: any) {
    const missingParameterOnDatabase = this.verifyExistRule(error.messages?.errors)
    if (missingParameterOnDatabase) {
      return {
        code: 404,
        message: `Provided ${missingParameterOnDatabase} parameter not exists on database`,
      }
    }
    const invalidParams = this.joinInvalidParameters(error.messages?.errors)
    if (invalidParams && !missingParameterOnDatabase) {
      return {
        code: 400,
        message: `Invalid parameters provided: ${invalidParams}`,
      }
    }
    return {
      code:400,
      message: 'Invalid parameters',
    }
  }

  public async handle (error: this) {
    const { message, code } = this.handleValidationFailure(error)
    throw new HttpException(message, code)
  }
}
