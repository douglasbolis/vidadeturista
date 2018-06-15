import { IBaseModel } from '.'

/**
 * Interface para as excursões dos usuários com as descrições de seus atributos.
 *
 * @export
 * @interface IMyExcursion
 * @extends {IBaseModel}
 */
export interface IMyExcursion extends IBaseModel {
  /**
   * Data da compra da passagem.
   *
   * @type {string}
   * @memberof IMyExcursion
   */
  datePurchase: string

  /**
   * Valor da passagem.
   *
   * @type {number}
   * @memberof IMyExcursion
   */
  value: number

  /**
   * Número de passagens compradas.
   *
   * @type {number}
   * @memberof IMyExcursion
   */
  numTicket: number

  /**
   * Valor total da compra.
   *
   * @type {number}
   * @memberof IMyExcursion
   */
  amount: number
}
