import { UserController } from '../controllers'
import { AppConfig } from '../config'
import { IUser } from '../interfaces'
import { PersistRouter } from '.'
import * as JSData from 'js-data'

export class UserRouter extends PersistRouter< IUser, UserController > {
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super( store, new UserController( store, appConfig ) )
  }
}
