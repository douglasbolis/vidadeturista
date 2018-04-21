import { Request, Response } from 'express'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as passport from 'passport'
import * as express from 'express'
import * as JSData from 'js-data'
import * as logger from 'morgan'

/**
 * Passport
 */
import * as Services from './services'
import * as Config from './config'
import * as Auth from './auth'

export class Application {
  app: express.Application
  store: JSData.DataStore
  passport: any
  appConfig: Config.AppConfig
  routes: ( app: express.Application, store: JSData.DataStore, passport: any, appConfig: Config.AppConfig ) => express.Application

  constructor ( cfg: Config.AppConfig, routes: (app: express.Application, store: JSData.DataStore, passport: any, appConfig: Config.AppConfig ) => express.Application ) {
    this.app = express()
    this.appConfig = cfg
    /**
     * Chamada os Handlers.
     */
    this.routes = routes
    this.passport = passport
    this.app = this.handleParsers( this.app )
    this.app = this.handleLogs( this.app )
    this.app = this.handleEnableCORS( this.app )
    this.store = this.handleJSData()
    this.app = this.handlePassport( this.app, this.store, this.passport )
    this.app = this.handleRoutes( this.app, this.store, this.passport )
    this.app = this.handleError( this.app )
  }

  public handleParsers ( app: express.Application ): express.Application {
    app.use( bodyParser.json() )
    app.use( bodyParser.urlencoded( { extended: false } ) )
    app.use( cookieParser() )
    return app
  }

  public handleLogs ( app: express.Application ): express.Application {
    app.use( logger( 'dev' ) )
    return app
  }

  public handleEnableCORS ( app: express.Application ): express.Application {
    app.use( ( req, res, next ) => {
      res.header( 'Access-Control-Allow-Origin', process.env.CORSALLOWED || '*' )
      res.header( 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH' )
      res.header( 'Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, If-Modified-Since, Cache-Control, enctype, Pragma' )

      if ( 'OPTIONS' === req.method ) {
        return res.send( 200 )
      } else {
        return next()
      }
    } )

    return app
  }

  /**
   * Adiciona a view engine.
   * Middleware responsavel pelo processamento da view.
   *
   */
  public handleJSData (): JSData.DataStore {
    /**
     * Definindo o adaptador JSData para o projeto
     */
    const store: JSData.DataStore = new JSData.DataStore()
    store.registerAdapter( this.appConfig.dbConfig.getDatabase(), this.appConfig.dbConfig.getAdapter(), this.appConfig.dbConfig.getAdapterOptions() )
    return store
  }

  public handlePassport ( app: express.Application, store: JSData.DataStore, passport: any ): express.Application {
    // required for passport
    this.passport = Auth.passportJwt( store, passport, this.appConfig )
    app.use( this.passport.initialize() )
    return app
  }

  public handleRoutes (app: express.Application, store: JSData.DataStore, passport: any): express.Application {
    /**
     * chamada no index para chamar todas as rotas
     */
    app = this.routes( app, store, passport, this.appConfig )
    // catch 404 and forward to error handler
    app.use( ( req: Request, res: Response, next: Function ) => {
      let err: any = new Error( 'Not Found' )
      err.status = 404
      next( err )
    } )

    return app
  }

  public handleError ( app: express.Application ): express.Application {
    // error handlers

    // development error handler
    // will print stacktrace
    if ( app.get( 'env' ) === 'development' ) {
      app.use( ( err: any, req: Request, res: Response, next: Function ) => {
        if ( !( err instanceof Services.APIError ) ) {
          err = new Services.APIError( err, err.status || err.statusCode || 500 )
        }
        return res.status( err.statusCode >= 100 && err.statusCode < 600 ? err.statusCode : 500 ).json( err.error )
      } )
    }

    // production error handler
    // no stacktraces leaked to user
    app.use( ( err: any, req: Request, res: Response, next: Function ) => {
      if ( !( err instanceof Services.APIError ) ) {
        err = new Services.APIError( err, err.status || err.statusCode || 500 )
      }
      return res.status( err.statusCode >= 100 && err.statusCode < 600 ? err.statusCode : 500 ).json( err.error )
    } )

    return app
  }
}
