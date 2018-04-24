import { ForgotRouter } from './forgot-router'
import { LoginRouter } from './login-router'
import { UserRouter } from './user-router'
import { UserDAO } from '../models/user'
import { Application } from 'express'
import { AppConfig } from '../config'
import * as JSData from 'js-data'
import * as Auth from '../auth'

export { BaseRouter, PersistRouter } from './base-router'

export namespace main {
  export const callRoutes = ( redis: any ) =>
    ( app: Application, store: JSData.DataStore, passport: any, appConfig: AppConfig ): Application => {
      const userDAO: UserDAO = new UserDAO( store, appConfig, redis )

      // Endpoints de acesso
      app.use( '/api/v1/forgot', new ForgotRouter( appConfig, userDAO ).getRouter() )
      app.use( '/api/v1/login', new LoginRouter( store, appConfig ).getRouter() )

      // Endpoints internos JWT token
      app.use( '/api/v1/users', Auth.authenticate( passport, appConfig ), new UserRouter( store, appConfig, redis ).getRouter() )

      return app
    }
}