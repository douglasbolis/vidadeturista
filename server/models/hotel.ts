import { IHotel } from '../interfaces'
import { BaseModel } from '.'

/**
 * Model Hotel.
 *
 * @export
 * @class Hotel
 * @extends {Models.BaseModel}
 * @implements {IHotel}
 */
export class Hotel extends BaseModel implements IHotel {
  name: string
  daily: number
  breakfast: boolean
  lunch: boolean
  dinner: boolean
  latitude?: number
  longitude?: number
  zipCode: string
  address: string
  number: string
  complement: string
  neighbor: string
  city: string
  state: string
  country: string
  constructor ( obj: IHotel ) {
    super( obj )
    this.name = obj.name
    this.daily = obj.daily || 0
    this.breakfast = obj.breakfast || true
    this.lunch = obj.lunch || true
    this.dinner = obj.dinner || true
    this.latitude = obj.latitude || null
    this.longitude = obj.longitude || null
    this.zipCode = obj.zipCode
    this.address = obj.address
    this.number = obj.number || null
    this.complement = obj.complement || null
    this.neighbor = obj.neighbor
    this.city = obj.city
    this.state = obj.state
    this.country = obj.country || 'Brasil'
  }
}
