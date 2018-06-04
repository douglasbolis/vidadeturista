/**
 * Buscando as variáveis de ambiente no arquivo .env.
 */
import * as dotenv from 'dotenv'
dotenv.config()

import { IRequest, IResponse, INextFunction } from './interfaces'
import { AppConfig } from './config'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as Services from './services'
import * as passport from 'passport'
import * as Config from './config'
import * as express from 'express'
import * as routes from './routes'
import * as JSData from 'js-data'
import * as logger from 'morgan'
import * as Auth from './auth'

/**
 * Class principal da aplicação.
 * Define todas as estruturas do sistema e conexão com o banco de dados.
 * 
 * @export
 * @class MainApp
 */
export class MainApp {
  private app: express.Application
  private store: JSData.DataStore
  private passport: any
  private appConfig: Config.AppConfig
  private routes: ( app: express.Application, store: JSData.DataStore, passport: any, appConfig: Config.AppConfig ) => express.Application

  public constructor () {
    /**
     * Atribuindo os valores das atividades.
     */
    this.app = express()
    this.passport = passport
    this.appConfig = new AppConfig()
    this.store = this.handleJSData()
    this.routes = routes.main.callRoutes
    /**
     * Chamada os Handlers.
     */
    this.handleParsers()
    this.handleLogs()
    this.handleEnableCORS()
    this.handlePassport()
    this.handleRoutes()
    this.handleError()
  }

  /**
   * Retorna o valor da variável app.
   * 
   * @returns {express.Application} Valor da variável app.
   * @memberof MainApp
   */
  public getApp (): express.Application {
    return this.app
  }

  /**
   * Definindo estrutura de conexão com o banco de dados.
   * 
   * @private
   * @returns {JSData.DataStore} Estrutura de conexão com o banco de dados.
   * @memberof MainApp
   */
  private handleJSData (): JSData.DataStore {
    /**
     * Definindo o adaptador JSData para o projeto.
     */
    const store: JSData.DataStore = new JSData.DataStore()
    store.registerAdapter(
      this.appConfig.dbConfig.getDatabase(),
      this.appConfig.dbConfig.getAdapter(),
      this.appConfig.dbConfig.getAdapterOptions()
    )
    return store
  }

  /**
   * Define os parsers de retorno dos objetos das requisições.
   * 
   * @private
   * @memberof MainApp
   */
  private handleParsers (): void {
    this.app.use( bodyParser.json( { limit: '50mb' } ) )
    this.app.use( bodyParser.urlencoded( { limit: '50mb', extended: true } ) )
    this.app.use( cookieParser() )
  }

  /**
   * Definie o middleware de logs.
   * 
   * @private
   * @memberof MainApp
   */
  private handleLogs (): void {
    this.app.use( logger( 'dev' ) )
  }

  /**
   * Define as permissões de CORS nas requisições.
   * 
   * @private
   * @memberof MainApp
   */
  private handleEnableCORS (): void {
    this.app.use( ( req: IRequest, res: IResponse, next: INextFunction ) => {
      res.header( 'Access-Control-Allow-Origin', process.env.CORSALLOWED || '*' )
      res.header( 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH' )
      res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, If-Modified-Since, Cache-Control, enctype, Pragma' )

      return ( 'OPTIONS' === req.method )  ? res.send( 200 ) : next()
    } )
  }

  /**
   * Define o middleware de autenticação dos usuários.
   * 
   * @private
   * @memberof MainApp
   */
  private handlePassport (): void {
    // required for passport
    this.passport = Auth.passportJwt( this.store, this.passport, this.appConfig )
    this.app.use( this.passport.initialize() )
  }

  /**
   * Define as estruturas de roteamento e modelagem.
   * 
   * @private
   * @memberof MainApp
   */
  private handleRoutes (): void {
    /**
     * chamada no index para chamar todas as rotas
     */
    this.app = this.routes( this.app, this.store, this.passport, this.appConfig )
    // catch 404 and forward to error handler
    this.app.use( ( req: IRequest, res: IResponse, next: INextFunction ) => {
      let err: any = new Error( 'Not Found' )
      err.status = 404
      next( err )
    } )
  }

  /**
   * Middleware de escape de erros não tratados na aplicação.
   * 
   * @private
   * @memberof MainApp
   */
  private handleError (): void {
    // error handlers

    // development error handler
    // will print stacktrace
    if ( Config.getEnv( 'NODE_ENV' ) === 'development' ) {
      this.app.use( ( err: any, req: IRequest, res: IResponse, next: INextFunction ) => {
        if ( !( err instanceof Services.APIError ) ) {
          err = new Services.APIError( err, err.status || err.statusCode || 500 )
        }
        return res.status( err.statusCode >= 100 && err.statusCode < 600 ? err.statusCode : 500 ).json( err.error )
      } )
    }

    // production error handler
    // no stacktraces leaked to user
    this.app.use( ( err: any, req: IRequest, res: IResponse, next: INextFunction ) => {
      if ( !( err instanceof Services.APIError ) ) {
        err = new Services.APIError( err, err.status || err.statusCode || 500 )
      }
      return res.status( err.statusCode >= 100 && err.statusCode < 600 ? err.statusCode : 500 ).json( err.error )
    } )
  }
}

/**
 * Para enviar a aplicacao a nivel do server será sempre levado o objeto app criado ao instanciar a aplicação.
 */
export const application = ( new MainApp() ).getApp()