import { moment, SendMail, ServiceLib } from '../services'
import { ISignupForgot, IUser } from '../interfaces'
import { AppConfig } from '../config'
import * as JSData from 'js-data'
import * as _ from 'lodash'
import * as url from 'url'

/**
 * Class for forgot dao.
 * 
 * @export
 * @class ForgotDAO
 */
export class ForgotDAO {
  private store: JSData.DataStore
  private serviceLib: ServiceLib
  private appConfig: AppConfig
  private sendMail: SendMail
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    this.sendMail = new SendMail( appConfig.mailConfig )
    this.serviceLib = new ServiceLib( appConfig )
    this.appConfig = appConfig
    this.store = store
  }

  /**
   * Envia um email de recuperação de senha para o usuário.
   *
   * @param {ISignupForgot} obj Objeto com o email para envio do email de recuperação de senha.
   * @returns {JSData.JSDataPromise< IUser >}
   *
   * @memberOf ForgotDAO
   */
  public sendForgotMail ( obj: ISignupForgot , appUrl: string): any {
    const filterEmail: any = { where: { email: { '===': obj.email } } }

    if ( !ServiceLib.emailValidator( obj.email ) ) {
      return ServiceLib.callMessageError( 'Email inválido.' , 400 )
    }

    return this.store.findAll( this.appConfig.getUsersTable(), filterEmail )
      .then( ( users: Array< IUser > ) => {
        if ( _.isEmpty( users ) ) {
          return ServiceLib.callMessageError( 'Usuário não encontrado.', 404 )
        }

        const user: IUser = _.head( users )
        const token: string = this.serviceLib.generateToken( obj.email )
        return this.sendMail.sendForgotEmail( `${ user.firstname } ${ user.lastname }`, obj.email, url.resolve( appUrl, token ) )
      } )
  }

  /**
   * Valida o token e retorna o user com email do token.
   *
   * @param {*} params
   * @returns {JSData.JSDataPromise< IUser >}
   *
   * @memberOf ForgotDAO
   */
  public validaToken ( params: any ): Promise< IUser > {
    const tokenDecrypted: string = this.serviceLib.decrypt( params.token )
    const data: any = JSON.parse( tokenDecrypted )
    const today: Date = new Date()
    const filterUser: any = { where: { email: { '===': data.email } } }

    return this.store.findAll( this.appConfig.getUsersTable(), filterUser )
      .then( ( users: Array< IUser > ) => {
        const user: IUser = _.head( users )
        if ( _.isEmpty( user ) ) {
          return ServiceLib.callMessageError( 'Token inválido.', 403 )
        } else
        if ( moment( data.expiration ) < moment( today ) ) {
          return ServiceLib.callMessageError( 'O token expirou.', 401 )
        } else
        if ( !user.active ) {
          return ServiceLib.callMessageError( 'A conta foi desativada.', 401 )
        }

        delete user.password
        return user
      } )
  }

  /**
   * Verifica o token e reseta a senha do usuário.
   *
   * @param {*} params Objeto com o token.
   * @param {*} obj Objeto com a nova senha.
   * @returns {Promise< boolean >}
   *
   * @memberOf ForgotDAO
   */
  public resetPassword ( params: any, obj: IUser ): Promise< boolean > {
    const data: any = JSON.parse( this.serviceLib.decrypt( params.token ) )
    const today: Date = new Date()
    const filterUser: any = { where: { email: { '===': data.email } } }

    return this.store.findAll( this.appConfig.getUsersTable(), filterUser )
      .then( ( users: Array< IUser > ) => {
        const user: IUser = _.head( users )
        if ( _.isEmpty( user ) ) {
          return ServiceLib.callMessageError( 'Token inválido.', 400 )
        } else
        if ( moment( data.expiration ) < moment( today ) ) {
          return ServiceLib.callMessageError( 'O token expirou.', 400 )
        } else
        if ( !user.active ) {
          return ServiceLib.callMessageError( 'A conta foi desativada.', 400 )
        } else
        if ( !obj.password ) {
          return ServiceLib.callMessageError( 'A nova senha não foi definida.', 400 )
        } else
        if ( obj.password.length < 6 ) {
          return ServiceLib.callMessageError( 'A nova senha deve conter no mínimo 6 caracteres.', 400 )
        }

        user.password = ServiceLib.hashPassword( obj.password )
        return this.store.update( this.appConfig.getUsersTable(), user.id, user )
      } )
      .then( () => true )
  }
}
