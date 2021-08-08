import FinancialRelease from 'App/Models/FinancialRelease'
import { DateTime } from 'luxon'

export default abstract class FinancialReleaseHook {
  public static updateReleaseDate (financialRelease: FinancialRelease) {
    if(!financialRelease.$dirty.release_date) {
      financialRelease.release_date = DateTime.now().set({
        hour: 0,
        minute: 0,
        second:0,
        millisecond: 0,
      })
    }
  }
}
