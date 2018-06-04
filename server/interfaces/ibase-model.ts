/**
 * Interface para o model base do sistema.
 * 
 * @export
 * @interface IBaseModel
 */
export interface IBaseModel {
  /**
   * Id do model.
   * 
   * @type {string}
   * @memberof IBaseModel
   */
  id: string
  
  /**
   * Flag de ativo.
   * Se _true_ o model está ativo.
   * 
   * @type {boolean}
   * @memberof IBaseModel
   */
  active: boolean
  
  /**
   * Data de criação do model.
   * 
   * @type {string}
   * @memberof IBaseModel
   */
  createdAt: string
  
  /**
   * Data de atualização dos dados do model.
   * 
   * @type {string}
   * @memberof IBaseModel
   */
  updatedAt: string
}
