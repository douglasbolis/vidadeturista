import { INextFunction, IRequest, IResponse } from '../interfaces'
import { BaseRouter } from './base-router'
import { jwtGenerator } from '../auth'
import { AppConfig } from '../config'
import { Router } from 'express'
import * as JSData from 'js-data'

export class LoginRouter extends BaseRouter {
  store: JSData.DataStore
  appConfig: AppConfig
  router: Router
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super()
    this.store = store
    this.router = Router()
    this.appConfig = appConfig
    this.routers()
  }

  public routers () {
    this.router.post( '/', (req: IRequest, res: IResponse, next?: INextFunction ): Promise< IResponse > =>
      this.respond( jwtGenerator( this.store, this.appConfig )( req, res, next ), res ) )
  }

  public getRouter (): Router {
    return this.router
  }
}
