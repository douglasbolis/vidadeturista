import { ServiceLib } from '../services/service-lib'
import { moment } from '../services/moment'
import { IBaseModel } from '../interfaces'
import * as _ from 'lodash'

/**
 * Model base para para as demais classes criadoras.
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
    if ( !_.isEmpty( obj ) ) {
      this.id = obj.id ? obj.id : ServiceLib.generateId()
      this.active = _.isBoolean( obj.active ) ? obj.active : true
    } else {
      this.id = ServiceLib.generateId()
      this.active = true
    }
    this.createdAt = obj.createdAt || moment().toISOString()
    this.updatedAt = obj.updatedAt || null
  }
}
