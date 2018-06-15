import { ETypePerson, ETypeUser, IPhone, IUser, ETypePhone } from '../interfaces'
import { BaseModel } from '.'
import * as _ from 'lodash'

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
    this.type = obj.type || ETypeUser.DEFAULT
    this.typePerson = obj.typePerson || ETypePerson.INDIVIDUAL
    this.numDocFed = obj.numDocFed
    this.phones = this.normalizePhones( obj.phones )
    this.photo = obj.photo || null
    this.dateBirth = obj.dateBirth
    this.zipCode = obj.zipCode
    this.address = obj.address
    this.number = obj.number
    this.complement = obj.complement || null
    this.neighbor = obj.neighbor
    this.city = obj.city
    this.state = obj.state
    this.country = obj.country || 'Brasil'
  }

  /**
   * Normaliza os dados telefônicos do usuário.
   *
   * @private
   * @param {*} phones Dados dos telefones.
   * @returns {Array< IPhone >} Array com os dados telefônicos do usuário.
   * @memberof User
   */
  private normalizePhones ( phones: any ): Array< IPhone > {
    if ( !_.isArray( phones ) ) {
      return []
    }

    const _phones: Array< IPhone > = phones
      .map( ( phone: any ) => {
        const _phone: IPhone = {} as IPhone
        try {
          _phone.phone = phone.phone
          _phone.type = phone.type || ETypePhone.MOBILE
        }
        catch ( e ) {}
        return _.isEmpty( _phone ) ? null : _phone
      } )

    return _.compact( _phones )
  }
}
