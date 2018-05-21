import { INextFunction, IRequest, IResponse } from '../interfaces'
import { ForgotController } from '../controllers'
import { BaseRouter } from './base-router'
import { AppConfig } from '../config'
import { Router } from 'express'
import * as JSData from 'js-data'

export class ForgotRouter extends BaseRouter {
  controller: ForgotController
  router: Router
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super()
    this.controller = new ForgotController( store, appConfig )
    this.router = Router()
    this.routers()
  }

  public routers () {
    /**
     * Envia link por email para resetar a senha.
     */
    this.router.post( '/' , ( req: IRequest, res: IResponse, next: INextFunction ) =>
      this.respond( this.controller.sendMail( req, res, next ), res ) )

    /**
     * Recupera os dados do usuário do token.
     */
    this.router.get( '/:token', ( req: IRequest, res: IResponse, next: INextFunction ) =>
      this.respond( this.controller.validaToken( req, res, next ), res ) )

    /**
     * Reseta a senha do usuário.
     */
    this.router.post( '/:token', ( req: IRequest, res: IResponse, next: INextFunction ) =>
      this.respond( this.controller.resetPassword( req, res, next ), res ) )
  }

  public getRouter (): Router {
    return this.router
  }
}
