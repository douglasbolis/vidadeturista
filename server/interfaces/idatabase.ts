/**
 * Interface para as configurações de conexão com o rethinkdb.
 * 
 * @export
 * @interface IRethinkDBConfig
 */
export interface IRethinkDBConfig {
  /**
   * Nome do host do banco de dados.
   * 
   * @type {string}
   * @memberof IRethinkDBConfig
   */
  host: string,

  /**
   * Número da porta do banco de dados.
   * 
   * @type {number}
   * @memberof IRethinkDBConfig
   */
  port: number,

  /**
   * Nome do banco de dados.
   * 
   * @type {string}
   * @memberof IRethinkDBConfig
   */
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
