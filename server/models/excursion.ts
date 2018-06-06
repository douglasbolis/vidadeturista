import { IAddress, IExcursion, IVehicle } from '../interfaces'
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
  vehicleId: string
  vehicle?: IVehicle
  value: number
}
