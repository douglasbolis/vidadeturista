import { IBaseModel } from './ibase-model'

/**
 * Interface para as buscas paginadas.
 * 
 * @export
 * @interface IResultSearch
 * @template T
 */
export interface IResultSearch< T extends IBaseModel > {
  /**
   * Número da página.
   * 
   * @type {number}
   * @memberof IResultSearch
   */
  page: number,
  
  /**
   * Número total de registros do tipo T no sistema.
   * 
   * @type {number}
   * @memberof IResultSearch
   */
  total: number,
  
  /**
   * Array com os dados paginados do tipo T.
   * 
   * @type {Array< T >}
   * @memberof IResultSearch
   */
  result: Array< T >
}
