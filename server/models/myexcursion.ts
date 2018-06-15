import { IMyExcursion } from '../interfaces'
import { moment } from '../services'
import { BaseModel } from '.'

/**
 * Model MyExcursion.
 *
 * @export
 * @class MyExcursion
 * @extends {Models.BaseModel}
 * @implements {IMyExcursion}
 */
export class MyExcursion extends BaseModel implements IMyExcursion {
  datePurchase: string
  value: number
  numTicket: number
  amount: number
  constructor ( obj: IMyExcursion ) {
    super( obj )
    this.datePurchase = obj.datePurchase || moment().toISOString()
    this.value = obj.value || 0
    this.numTicket = obj.numTicket || 1
    this.amount = obj.amount || this.value * this.numTicket
  }
}
