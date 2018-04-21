import { IDefaultAdapterOptions } from '../interfaces'
import { getEnv } from './utils'
import * as JSDataRethinkDB from 'js-data-rethinkdb'

/**
 * Classe para as configurações de banco de dados.
 * 
 * @export
 * @class DatabaseConfig
 */
export class DatabaseConfig {
  private _adapterOptions: IDefaultAdapterOptions
  private _adapter: JSDataRethinkDB.RethinkDBAdapter
  private _database: string
  public constructor () {
    let opts: JSDataRethinkDB.IBaseRethinkDBAdapter = {
      rOpts: {
        servers: [
          { host: getEnv( 'SERVER_RETHINKDB_HOST' ) || 'localhost' }
        ],
        db: getEnv( 'SERVER_RETHINKDB_DB' ) || 'appserver'
      }
    }

    this._adapterOptions = { default: true }
    this._database = 'rethinkdb'
    this._adapter = new JSDataRethinkDB.RethinkDBAdapter( opts )
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
