import { INextFunction, IRequest, IResponse } from '../interfaces'
import { ServiceLib } from '../services'
import { AppConfig } from '../config'
import { ForgotDAO } from '../dao'
import * as nodemailer from 'nodemailer'
import * as JSData from 'js-data'

/**
 * Class for forgot controller.
 * 
 * @export
 * @class ForgotController
 */
export class ForgotController {
  forgot: ForgotDAO
  appConfig: AppConfig
  constructor ( store: JSData.DataStore, appConfig: AppConfig, transporter?: nodemailer.Transporter ) {
    this.appConfig = appConfig
    this.forgot = new ForgotDAO( store, appConfig, transporter )
  }

  /**
   * Envia um email para resetar a senha do usuário que a esqueceu
   *
   * @param {IRequest} req
   * @param {IResponse} res
   * @param {INextFunction} [next]
   * @returns {Promise< any >}
   *
   * @memberOf ForgotController
   */
  public sendMail ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< any > {
    return this.forgot.sendForgotMail( req.body, this.appConfig.getForgotUrl() )
      .then( () => {
        res.status( 200 )
        return { message: 'Email enviado' }
      } )
      .catch( ( err: any ) => ServiceLib.callMessageError( err, 400 ) )
  }

  /**
   * Valida o token do parâmetro.
   *
   * @param {IRequest} req
   * @param {IResponse} res
   * @param {INextFunction} next
   * @returns {Promise< any >}
   *
   * @memberOf ForgotController
   */
  public validaToken ( req: IRequest, res: IResponse, next: INextFunction ): Promise< any > {
    return this.forgot.validaToken( req.params )
      .then( ( dados: any ) => {
        res.status( 200 )
        return dados
      } )
      .catch( ( err: any ) => ServiceLib.callMessageError( err, 401 ) )
  }

  /**
   * Verifica o token e reseta a senha do usuário.
   *
   * @param {IRequest} req
   * @param {IResponse} res
   * @param {INextFunction} next
   * @returns {Promise< any >}
   *
   * @memberOf ForgotController
   */
  public resetPassword ( req: IRequest, res: IResponse, next: INextFunction ): Promise< any > {
    return this.forgot.resetPassword( req.params, req.body )
      .then( ( dados: any ) => {
        res.status( 200 )
        return dados
      } )
      .catch( ( err: any ) => ServiceLib.callMessageError( err, 401 ) )
  }
}
