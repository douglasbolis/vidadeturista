import { SignupRouter } from './signup-router'
import { ForgotRouter } from './forgot-router'
import { LoginRouter } from './login-router'
import { UserRouter } from './user-router'
import { Application } from 'express'
import { AppConfig } from '../config'
import * as JSData from 'js-data'
import * as Auth from '../auth'

export namespace main {
  export const callRoutes = ( app: Application, store: JSData.DataStore, passport: any, appConfig: AppConfig ): Application => {
    // Endpoints de acesso
    app.use( '/api/v1/signup', new SignupRouter( store, appConfig ).getRouter() )
    app.use( '/api/v1/forgot', new ForgotRouter( store, appConfig ).getRouter() )
    app.use( '/api/v1/login', new LoginRouter( store, appConfig ).getRouter() )

    // Endpoints internos - Authentication JWT
    // app.use( '/api/v1/users', Auth.authenticate( passport, appConfig ), new UserRouter( store, appConfig ).getRouter() )
    app.use( '/api/v1/users', new UserRouter( store, appConfig ).getRouter() )

    return app
  }
}
