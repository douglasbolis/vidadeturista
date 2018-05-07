import { BasePersistController } from '.'
import { IUser } from '../interfaces'
import { AppConfig } from '../config'
import { UserDAO } from '../dao'
import * as JSData from 'js-data'

/**
 * Class UserController.
 * 
 * @export
 * @class UserController
 * @extends {BasePersistController<IUser>}
 */
export class UserController extends BasePersistController< IUser > {
  public constructor ( store: JSData.DataStore, appConfig: AppConfig, redis: any ) {
    super( new UserDAO( store, appConfig ) )
  }
}
