import { IRequest, IResponse, INextFunction } from '../interfaces'
import { SignupController } from '../controllers'
import { BaseRouter } from './base-router'
import { AppConfig } from '../config'
import { Router } from 'express'
import * as nodemailer from 'nodemailer'
import * as JSData from 'js-data'

/**
 * Class for signup router.
 * 
 * @export
 * @class SignupRouter
 * @extends {BaseRouter}
 */
export class SignupRouter extends BaseRouter {
  controller: SignupController
  router: Router
  constructor ( store: JSData.DataStore, appConfig: AppConfig, transporter?: nodemailer.Transporter ) {
    super()
    this.controller = new SignupController( store, appConfig, transporter )
    this.router = Router()
    this.routers()
  }

  public routers () {
    /**
     * Envia link por email para completar cadastro.
     */
    this.router.post( '/' , ( req: IRequest, res: IResponse, next: INextFunction ) =>
      this.respond( this.controller.sendMail( req, res, next ), res ) )

    /**
     * Recupera os dados do usuário do token.
     */
    this.router.get( '/:token', ( req: IRequest, res: IResponse, next: INextFunction ) =>
      this.respond( this.controller.validaToken( req, res, next ), res ) )

    /**
     * Confirma o cadastro e insere o restante dos dados do usuário.
     */
    this.router.post( '/:token', ( req: IRequest, res: IResponse, next: INextFunction ) =>
      this.respond( this.controller.registerPassword( req, res, next ), res ) )
  }

  public getRouter (): Router {
    return this.router
  }
}
