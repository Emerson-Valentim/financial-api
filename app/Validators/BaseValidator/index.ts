import ValidationException from 'App/Exceptions/ValidationException'
import HttpException from 'App/Exceptions/HttpException'
type ValidateError = {
  rule: string
  field: string
  message: string
}

export default abstract class BaseValidator {
  public static async validate (request, validatorMethod: string, validator) {
    try {
      const data = await request.validate({schema: validator[validatorMethod]()})
      return data
    } catch (error) {
      const { message, status } = ValidationException.handleValidationFailure(error)
      throw new HttpException(message, status)
    }
  }

  private static verifyExistRule (errorsArray: Array<ValidateError>) {
    for (let item of errorsArray) {
      if (item.rule === 'exists') {
        return item.field
      }
    }
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
}
