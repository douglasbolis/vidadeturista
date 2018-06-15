import { IAddress, IExcursion, IVehicle } from '../interfaces'
import { moment } from '../services'
import { BaseModel } from '.'

/**
 * Model Excursion.
 *
 * @export
 * @class Excursion
 * @extends {Models.BaseModel}
 * @implements {IExcursion}
 */
export class Excursion extends BaseModel implements IExcursion {
  origin: IAddress
  destiny: IAddress
  date: string
  vehiclesId: Array< string >
  vehicles?: Array< IVehicle >
  value: number
  fuel: number
  snack: boolean
  breakfast: boolean
  lunch: boolean
  dinner: boolean
  constructor ( obj: IExcursion ) {
    super( obj )
    this.origin = obj.origin || null
    this.destiny = obj.destiny || null
    this.date = obj.date || moment().toISOString()
    this.vehiclesId = obj.vehiclesId || []
    this.value = obj.value
    this.fuel = obj.fuel || 0
    this.snack = obj.snack || false
    this.breakfast = obj.breakfast || false
    this.lunch = obj.lunch || false
    this.dinner = obj.dinner || false
  }
}
