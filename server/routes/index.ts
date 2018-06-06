import { ExcursionRouter } from './excursion-router'
import { ForgotRouter } from './forgot-router'
import { LoginRouter } from './login-router'
import { SignupRouter } from './signup-router'
import { UserRouter } from './user-router'
import { Application } from 'express'
import { AppConfig } from '../config'
import { Auth } from '../auth'
import * as JSData from 'js-data'

export namespace main {
  export const callRoutes = ( app: Application, store: JSData.DataStore, passport: any, appConfig: AppConfig ): Application => {
    // Endpoints de acesso
    app.use( '/api/v1/signup', new SignupRouter( store, appConfig ).getRouter() )
    app.use( '/api/v1/forgot', new ForgotRouter( store, appConfig ).getRouter() )
    app.use( '/api/v1/login', new LoginRouter( store, appConfig ).getRouter() )

    // Endpoints internos autenticados com JWT
    app.use( '/api/v1/users', Auth.authenticate( passport, appConfig ), new UserRouter( store, appConfig ).getRouter() )
    app.use( '/api/v1/excursions', Auth.authenticate( passport, appConfig ), new ExcursionRouter( store, appConfig ).getRouter() )

    return app
  }
}
