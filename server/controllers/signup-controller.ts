import { INextFunction, IRequest, IResponse } from '../interfaces'
import { ServiceLib } from '../services'
import { AppConfig } from '../config'
import { SignupDAO } from '../dao'
import * as JSData from 'js-data'

/**
 * Class for signup controller.
 * 
 * @export
 * @class SignupController
 */
export class SignupController {
  signupDAO: SignupDAO
  config: AppConfig

  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    this.config = appConfig
    this.signupDAO = new SignupDAO( store, appConfig )
  }
  /**
   * Envia um email para criar o primeiro login
   *
   * @param {IRequest} req
   * @param {IResponse} res
   * @param {INextFunction} [next]
   * @returns {Promise< any >}
   *
   * @memberOf ForgotController
   */
  public sendMail ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< any > {
    return this.signupDAO.sendSignUpMail( req.body, this.config.getSignUpUrl() )
      .then( () => {
        res.status( 200 )
        return { message: 'Email enviado' }
      } )
      .catch( ( err: any ) => ServiceLib.callMessageError( err, 400 ) )
  }

  /**
   * Valida o token da requisição.
   *
   * @param {IRequest} req
   * @param {IResponse} res
   * @param {INextFunction} next
   * @returns {Promise< any >}
   *
   * @memberOf SignupController
   */
  public validaToken ( req: IRequest, res: IResponse, next: INextFunction ): Promise< any > {
    return this.signupDAO.validaToken( req.params )
      .then( ( dados: any ) => {
        res.status( 200 )
        return dados
      } )
      .catch( ( err: any ) => ServiceLib.callMessageError( err, 401 ) )
  }

  /**
   * Verifica o token e cadastra a senha para o usuário
   *
   * @param {IRequest} req
   * @param {IResponse} res
   * @param {INextFunction} next
   * @returns {Promise< any >}
   *
   * @memberOf SignupController
   */
  public registerPassword ( req: IRequest, res: IResponse, next: INextFunction ): Promise< any > {
    return this.signupDAO.registerPassword( req.params, req.body )
      .then( ( dados: any ) => {
        res.status( 200 )
        return dados
      } )
      .catch( ( err: any ) => ServiceLib.callMessageError( err, 401 ) )
  }
}
