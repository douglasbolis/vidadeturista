import { IAddress, IBaseModel } from '.'

/**
 * Interface para os hotéis com as descrições de seus atributos.
 *
 * @export
 * @interface IHotel
 * @extends {IBaseModel}
 * @extends {IAddress}
 */
export interface IHotel extends IBaseModel, IAddress {
  /**
   * Nome do hotel.
   *
   * @type {string}
   * @memberof IHotel
   */
  name: string

  /**
   * Valor da diária do hotel.
   *
   * @type {number}
   * @memberof IHotel
   */
  daily: number

  /**
   * O hotel possui café-da-manhã?
   *
   * @type {boolean}
   * @memberof IHotel
   */
  breakfast: boolean

  /**
   * O hotel possui almoço?
   *
   * @type {boolean}
   * @memberof IHotel
   */
  lunch: boolean

  /**
   * O hotel possui jantar?
   *
   * @type {boolean}
   * @memberof IHotel
   */
  dinner: boolean
}
