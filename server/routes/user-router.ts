import { UserController } from '../controllers'
import { DAORouter } from './dao-router'
import { AppConfig } from '../config'
import { IUser } from '../interfaces'
import * as JSData from 'js-data'

/**
 * Classe de roteamento para os usuários.
 * 
 * @export
 * @class UserRouter
 * @extends {DAORouter<IUser, UserController>}
 */
export class UserRouter extends DAORouter< IUser, UserController > {
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super( store, new UserController( store, appConfig ) )
  }
}
