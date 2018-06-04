import { ETypePerson, ETypeUser, IPhone, IUser } from '../interfaces'
import { BaseModel } from '.'

/**
 * Model User.
 *
 * @export
 * @class User
 * @extends {Models.BaseModel}
 * @implements {IUser}
 */
export class User extends BaseModel implements IUser {
  firstname: string
  lastname: string
  companyAlias?: string
  username: string
  email: string
  password: string
  type: ETypeUser
  typePerson: ETypePerson
  numDocFed: string
  phones: Array< IPhone >
  photo: string
  dateBirth: string
  // Address.
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
  constructor ( obj: IUser ) {
    super( obj )
    this.firstname = obj.firstname
    this.lastname = obj.lastname
    this.username = obj.username
    this.email = obj.email
    this.password = obj.password
    this.type = obj.type
    this.typePerson = obj.typePerson
    this.numDocFed = obj.numDocFed
    this.phones = obj.phones
    this.photo = obj.photo
    this.dateBirth = obj.dateBirth
    this.zipCode = obj.zipCode
    this.address = obj.address
    this.number = obj.number
    this.complement = obj.complement
    this.neighbor = obj.neighbor
    this.city = obj.city
    this.state = obj.state
    this.country = obj.country
  }
}
