import { ServiceLib } from '../services/service-lib'
import { IBaseModel } from '../interfaces'
import * as _ from 'lodash'

/**
 * Model para para as demais classes criadoras.
 * 
 * @export
 * @abstract
 * @class BaseModel
 * @implements {IBaseModel}
 */
export abstract class BaseModel implements IBaseModel {
  id?: string
  active?: boolean
  createdAt?: string
  updatedAt?: string
  constructor ( obj?: IBaseModel ) {
    if ( obj ) {
      this.id = obj.id ? obj.id : ServiceLib.generateId()
      this.active = ( obj.active === null || obj.active === undefined ) ? true : obj.active
    } else {
      this.id = ServiceLib.generateId()
      this.active = true
    }
    this.createdAt = obj.createdAt || new Date().toISOString()
    this.updatedAt = obj.updatedAt || null
  }
}
