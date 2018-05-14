import { IBaseUser } from '../interfaces'
import { BaseModel } from '.'

/**
 * Model base para para as demais classes criadoras.
 * 
 * @export
 * @abstract
 * @class BaseUser
 * @implements {IBaseUser}
 */
export class BaseUser extends BaseModel implements IBaseUser {
  firstname: string
  lastname: string
  companyAlias?: string
  username: string
  email: string
  password: string
  constructor ( obj: IBaseUser ) {
    super()
    this.firstname = obj.firstname
    this.lastname = obj.lastname
    this.companyAlias = obj.companyAlias
    this.username = obj.username
    this.email = obj.email
    this.password = obj.password
  }
}
