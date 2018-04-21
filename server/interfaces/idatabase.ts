/**
 * Interface para as configurações de conexão com o rethinkdb.
 * 
 * @export
 * @interface IRethinkDBConfig
 */
export interface IRethinkDBConfig {
  host: string,
  port: number,
  db: string
}

/**
 * Interface para as opções do adapter.
 * 
 * @export
 * @interface IDefaultAdapterOptions
 */
export interface IDefaultAdapterOptions {
  default: boolean
}
