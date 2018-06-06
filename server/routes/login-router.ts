import { INextFunction, IRequest, IResponse } from '../interfaces'
import { BaseRouter } from './base-router'
import { PassportJwtLocal } from '../auth'
import { AppConfig } from '../config'
import { Router } from 'express'
import * as JSData from 'js-data'

/**
 * Classe de definição do endpoint de login.
 *
 * @export
 * @class LoginRouter
 * @extends {BaseRouter}
 */
export class LoginRouter extends BaseRouter {
  private store: JSData.DataStore
  private appConfig: AppConfig
  private router: Router
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super()
    this.store = store
    this.router = Router()
    this.appConfig = appConfig
    this.routers()
  }

  /**
   * Define os endpoints de login.
   *
   * @memberof LoginRouter
   */
  public routers () {
    this.router.post( '/', (req: IRequest, res: IResponse, next?: INextFunction ): Promise< IResponse > =>
      this.respond( PassportJwtLocal.jwtGenerator( this.store, this.appConfig )( req, res, next ), res ) )
  }

  /**
   * Método get da definição dos endpoints.
   *
   * @returns {Router} Definição do endpoint de login.
   * @memberof LoginRouter
   */
  public getRouter (): Router {
    return this.router
  }
}
