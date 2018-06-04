import { IBaseRethinkDBAdapter, RethinkDBAdapter } from 'js-data-rethinkdb'
import { IDefaultAdapterOptions } from '../interfaces'
import { getEnv } from './utils'

/**
 * Classe para as configurações de conexão com o banco de dados.
 * 
 * @export
 * @class DatabaseConfig
 */
export class DatabaseConfig {
  private _adapterOptions: IDefaultAdapterOptions
  private _adapter: RethinkDBAdapter
  private _database: string
  public constructor () {
    // Definindo conexão com o banco de dados.
    let opts: IBaseRethinkDBAdapter = {
      rOpts: {
        host: getEnv( 'SERVER_RETHINKDB_HOST' ) || 'localhost',
        port: getEnv( 'SERVER_RETHINKDB_PORT' ) || 28015,
        db: getEnv( 'SERVER_RETHINKDB_DB' ) || 'vidadeturista'
      }
    }

    this._adapterOptions = { default: true }
    this._database = 'rethinkdb'
    this._adapter = new RethinkDBAdapter( opts )
  }

  public getAdapterOptions () {
    return this._adapterOptions
  }

  public getDatabase () {
    return this._database
  }

  public getAdapter () {
    return this._adapter
  }
}
