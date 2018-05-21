import { UserController } from '../controllers'
import { PersistRouter } from './base-router'
import { AppConfig } from '../config'
import { IUser } from '../interfaces'
import * as JSData from 'js-data'

export class UserRouter extends PersistRouter< IUser, UserController > {
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super( store, new UserController( store, appConfig ) )
  }
}
