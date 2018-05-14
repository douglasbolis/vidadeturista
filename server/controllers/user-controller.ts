import { IUser } from '../interfaces'
import { AppConfig } from '../config'
import { DAOController } from '.'
import { UserDAO } from '../dao'
import * as JSData from 'js-data'

/**
 * Class UserController.
 * 
 * @export
 * @class UserController
 * @extends {DAOController<IUser>}
 */
export class UserController extends DAOController< IUser > {
  public constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super( new UserDAO( store, appConfig ) )
  }
}
