import { Request, Response, Router, NextFunction } from 'express'
import { SignupController } from '../controllers'
import { BaseRouter } from './base-router'
import { IBaseUser } from '../interfaces'
import { AppConfig } from '../config'
import { DAO } from '../models'
import * as JSData from 'js-data'
import * as nodemailer from 'nodemailer'

export class SignupRouter extends BaseRouter {
  controller: SignupController
  store: JSData.DataStore
  router: Router
  constructor ( appConfig: AppConfig, userDAO: DAO< IBaseUser >, transporter?: nodemailer.Transporter ) {
    super()
    this.controller = new SignupController( appConfig, userDAO, transporter )
    this.router = Router()
    this.routers()
  }

  public routers () {
    /**
     * Envia link por email para completar cadastro.
     */
    this.router.post( '/' , ( req: Request, res: Response, next: NextFunction ) =>
      this.respond( this.controller.sendMail( req, res, next ), res ) )

    /**
     * Recupera os dados do usuário do token.
     */
    this.router.get( '/:token', ( req: Request, res: Response, next: NextFunction ) =>
      this.respond( this.controller.validaToken( req, res, next ), res ) )

    /**
     * Confirma o cadastro e insere o restante dos dados do usuário.
     */
    this.router.post( '/:token', ( req: Request, res: Response, next: NextFunction ) =>
      this.respond( this.controller.registerPassword( req, res, next ), res ) )
  }

  public getRouter (): Router {
    return this.router
  }
}
