import { moment, SendMail, ServiceLib } from '../services'
import { ISignupForgot, IUser } from '../interfaces'
import { AppConfig } from '../config'
import { UserDAO } from '../dao'
import{ User } from '../models'
import * as nodemailer from 'nodemailer'
import * as JSData from 'js-data'
import * as url from 'url'
import* as _ from 'lodash'

/**
 * Class for siggnup.
 *
 * @export
 * @class SignupDAO
 */
export class SignupDAO {
  private store: JSData.DataStore
  private serviceLib: ServiceLib
  private appConfig: AppConfig
  private sendMail: SendMail
  private userDAO: UserDAO
  constructor ( store: JSData.DataStore, appConfig: AppConfig, transporter?: nodemailer.Transporter ) {
    this.sendMail = new SendMail( appConfig.mailConfig, transporter )
    this.userDAO = new UserDAO( store, appConfig )
    this.serviceLib = new ServiceLib( appConfig )
    this.appConfig = appConfig
    this.store = store
  }

  /**
   * Envia um email _signup_ para o usuário.
   *
   * @param {ISignupForgot} obj Objeto de dados com o email do novo usuário.
   * @returns {JSData.JSDataPromise<IUser>}
   * @memberOf SignupDAO
   */
  public sendSignUpMail ( obj: ISignupForgot, appUrl: string ): any {
    if ( !ServiceLib.emailValidator( obj.email ) ) {
      return ServiceLib.callMessageError( 'Email inválido.', 400 )
    }

    const token: string = this.serviceLib.generateToken( obj.email )
    return this.sendMail.sendConfirmationEmail( obj.email, url.resolve( appUrl, token ) )
  }

  /**
   * Valida o token e retorna o user com email do token.
   *
   * @param {*} params Objeto com o tokem para validação.
   * @returns {Promise< boolean >}
   * @memberOf SignupDAO
   */
  public validaToken ( params: any ): Promise< boolean > {
    const today: Date = new Date()
    const tokenDecrypted: string = this.serviceLib.decrypt( params.token )

    try {
      const data: any = JSON.parse( tokenDecrypted )
      if ( moment( data.expiration ) < moment( today ) ) {
        return ServiceLib.callMessageError( 'O token expirou.', 401 )
      }
      return Promise.resolve( true )
    } catch ( e ) {
      return ServiceLib.callMessageError( 'Token inválido.', 401, e.message )
    }
  }

  /**
   * Verifica o token e insere a senha criptografada para o usuário.
   *
   * @param {*} params Objeto com o token para validação.
   * @param {*} obj Objeto com os dados do usuário.
   * @returns {Promise< boolean >} Booleano indicando o sucesso da operação.
   *
   * @memberOf SignupDAO
   */
  public registerPassword ( params: any, obj: any ): Promise< boolean > {
    const data: any = JSON.parse( this.serviceLib.decrypt( params.token ) )
    const today: Date = new Date()
    const filterUser: any = { where: { email: { '===': data.email } } }

    if ( moment( data.expiration ).isAfter( moment( today ) ) ) {
      return ServiceLib.callMessageError( 'O token expirou.', 401 )
    }

    return this.store.findAll( this.appConfig.getUsersTable(), filterUser )
      .then( ( users: Array< IUser > ) => {
        const user = new User( obj )
        user.email = data.email
        const errValidation = this.userDAO.schema.validate( user )

        if ( _.isEmpty( errValidation ) ) {
          return ServiceLib.callMessageError( 'Erro de entrada.', 400, errValidation )
        } else
        if ( users.length ) {
          return ServiceLib.callMessageError( 'Usuário já cadastrado.', 401 )
        } else
        if ( !user.password ) {
          return ServiceLib.callMessageError( 'A senha não foi definida.', 401 )
        } else
        if ( user.password.length < 6 ) {
          return ServiceLib.callMessageError( 'A senha deve conter no mínimo 6 caracteres.', 401 )
        }

        user.password = ServiceLib.hashPassword( user.password )
        return this.store.create( this.appConfig.getUsersTable(), user )
      } )
      .then( () => true )
  }
}
