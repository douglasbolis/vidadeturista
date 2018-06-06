import { INextFunction, IRequest, IResponse, IUser } from '../interfaces'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { APIError, ServiceLib } from '../services'
import { AppConfig } from '../config'
import * as jwt from 'jsonwebtoken'
import * as JSData from 'js-data'
import * as _ from 'lodash'

/**
 * Classe de definição do passport jwt local.
 *
 * @export
 * @class PassportJwtLocal
 */
export class PassportJwtLocal {
  /**
   * Método para autenticação dos usuário nas requisições autenticadas.
   *
   * @static
   * @param {JSData.DataStore} store Contexto da conexão com o banco de dados.
   * @param {*} passport Definição do passport.
   * @param {AppConfig} appConfig Objeto com os dados para validação do token no header da requisição.
   * @returns {*}
   * @memberof PassportJwtLocal
   */
  public static passportJwt ( store: JSData.DataStore, passport: any, appConfig: AppConfig ): any {
    const params = {
      secretOrKey: appConfig.getJwtConfig().secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    passport.use( new Strategy( params, ( token: any, done: Function ) => {
      store.find( appConfig.getUsersTable(), token.userId )
        .then( ( record: JSData.Record ) => {
          const user: IUser = record.toJSON()
  
          if ( _.isEmpty( user ) ) {
            return ServiceLib.callMessageError( 'Usuário não encontrado.', 404 )
          } else
          if ( !user.active ) {
            return ServiceLib.callMessageError( 'Usuário desabilitado.', 401 )
          }
  
          return done( null, user )
        } )
        .catch( ( err: APIError ) => done( null, false, err.message ) )
    } ) )
  
    passport.serializeUser( ( user: IUser, done: Function ) => done( null, user ) )
  
    passport.deserializeUser( ( user: IUser, done: Function ) => done( null, user ) )
  
    return passport
  }

  /**
   * Busca o usuário e gera o token de autenticação.
   *
   * @static
   * @param {JSData.DataStore} store Contexto da conexão com o banco de dados.
   * @param {AppConfig} appConfig Objeto com os dados para validação do token no header da requisição.
   * @returns {Function}
   * @memberof PassportJwtLocal
   */
  public static jwtGenerator ( store: JSData.DataStore, appConfig: AppConfig ): Function {
    return ( req: IRequest, res: IResponse, next: INextFunction ): Promise< string > => {
      const { email, password } = req.body
      const filterMail = { where: { email: email } }
      const messageDefault: string = 'Email e/ou senha incorretos.'
    
      if ( _.isEmpty( email ) || _.isEmpty( password ) ) {
        return ServiceLib.callMessageError( messageDefault, 403 )
      }
    
      return store.findAll( appConfig.getUsersTable(), filterMail )
        .then( ( users: Array< IUser > ) => {
          const user: IUser = _.head( users )
    
          if ( !user ) {
            return ServiceLib.callMessageError( messageDefault, 403 )
          }
    
          const userParsed: any = JSON.parse( JSON.stringify( user ) )
          const encryptedPassword: boolean = ServiceLib.comparePassword( password, userParsed.password )
    
          if ( !encryptedPassword ) {
            return ServiceLib.callMessageError( messageDefault, 403 )
          } else
          if ( !user.active ) {
            return ServiceLib.callMessageError( 'A conta do usuário foi encerrada.', 401 )
          }
    
          const days: string = appConfig.getExpirationDays() ? appConfig.getExpirationDays().toString( 10 ) : '3'
          return `JWT ${ jwt.sign( { userId: user.id }, appConfig.getJwtConfig().secret, { expiresIn: `${days} days` } ) }`
        } )
        .catch( ( err: APIError ) => ServiceLib.callMessageError( err.message, err.statusCode ) )
    }
  }
}
