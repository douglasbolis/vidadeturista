/**
 * Buscando as variáveis de ambiente no arquivo .env.
 */
import * as dotenv from 'dotenv'
dotenv.config()

import { Application } from './application'
import { AppConfig } from './config'
import * as cookieParser from 'cookie-parser'
import * as bodyParser from 'body-parser'
import * as express from 'express'

/**
 * Import dos endpoints da api.
 */
import * as routes from './routes'

class MainApp extends Application {
  constructor () {
    let cfg: AppConfig = new AppConfig()
    super( cfg, routes.main.callRoutes )
    this.app.use( bodyParser.json( { limit: '50mb' } ) )
    this.app.use( bodyParser.urlencoded( { limit: '50mb', extended: true } ) )
  }

  public handleParsers ( app: express.Application ): express.Application {
    app.use( bodyParser.json( { limit: '50mb' } ) )
    app.use( bodyParser.urlencoded( { limit: '50mb', extended: true } ) )
    app.use( cookieParser() )
    return app
  }
}

/**
 * Para enviar a aplicacao a nivel do server será sempre levado o objeto app criado ao instanciar a aplicação.
 */
export let application = ( new MainApp() ).app
