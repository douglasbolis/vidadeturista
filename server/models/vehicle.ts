import { ETypeVehicle, IVehicle } from '../interfaces'
import { BaseModel } from '.'

/**
 * Model Vehicle.
 *
 * @export
 * @class Vehicle
 * @extends {Models.BaseModel}
 * @implements {IVehicle}
 */
export class Vehicle extends BaseModel implements IVehicle {
  type: ETypeVehicle
  numSeat: number
  licensePlate: string
  renavam: string
  fuel: number
  wc: boolean
  constructor ( obj: IVehicle ) {
    super( obj )
    this.type = obj.type || ETypeVehicle.BUS
    this.numSeat = obj.numSeat || 1
    this.licensePlate = obj.licensePlate
    this.renavam = obj.renavam
    this.fuel = obj.fuel || 1
    this.wc = obj.wc || false
  }
}
