import { IBaseMongoDBAdapter, MongoDBAdapter } from 'js-data-mongodb'
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
  private _adapter: MongoDBAdapter
  private _database: string
  public constructor () {
    // Definindo conexão com o banco de dados.
    let port: string = getEnv( 'SERVER_MONGODB_PORT' ) || '27017'
    let host: string = getEnv( 'SERVER_MONGODB_HOST' ) || 'localhost'
    let db: string = getEnv( 'SERVER_MONGODB_DB' ) || 'vidadeturista'
    let opts: IBaseMongoDBAdapter = {
      uri: `mongodb://${ host }:${ port }/${ db }`
    } 

    // Configuração do banco de dados.
    this._adapterOptions = { default: true }
    this._database = 'mongodb'
    this._adapter = new MongoDBAdapter( opts )
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
