import { Router, Response, NextFunction } from 'express'
import { ForgotController } from '../controllers'
import { UserDAO } from '../models/user'
import { AppConfig } from '../config'
import { BaseRouter } from '.'
import * as nodemailer from 'nodemailer'

export class ForgotRouter extends BaseRouter {
  controller: ForgotController
  router: Router
  constructor ( appConfig: AppConfig, userDAO: UserDAO, transport?: nodemailer.Transporter ) {
    super()
    this.controller = new ForgotController( appConfig, userDAO, transport )
    this.router = Router()
    this.routers()
  }

  public routers () {
    /**
     * Envia link por email para resetar a senha.
     */
    this.router.post( '/' , ( req: any, res: Response, next: NextFunction ) =>
      this.respond( this.controller.sendMail( req, res, next ), res ) )

    /**
     * Recupera os dados do usuário do token.
     */
    this.router.get( '/:token', ( req: any, res: Response, next: NextFunction ) =>
      this.respond( this.controller.validaToken( req, res, next ), res ) )

    /**
     * Reseta a senha do usuário.
     */
    this.router.post( '/:token', ( req: any, res: Response, next: NextFunction ) =>
      this.respond( this.controller.resetPassword( req, res, next ), res ) )
  }

  public getRouter (): Router {
    return this.router
  }
}
