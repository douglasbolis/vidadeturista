import { IAddress, IBaseModel, IVehicle } from '.'

/**
 * Interface para as exercursões com as descrições de seus atributos.
 *
 * @export
 * @interface IExcursion
 * @extends {IAddress}
 */
export interface IExcursion extends IBaseModel {
  /**
   * Dados da origem da excursão.
   * Ponto de partida da excursão.
   *
   * @type {IAddress}
   * @memberof IExcursion
   */
  origin: IAddress

  /**
   * Dados do destino da excursão.
   * Ponto de chegada da excursão.
   *
   * @type {IAddress}
   * @memberof IExcursion
   */
  destiny: IAddress

  /**
   * Data/horário da excursão.
   * Data/horário de partida da excursão.
   *
   * @type {string}
   * @memberof IExcursion
   */
  date: string

  /**
   * Id do veículo da excursão.
   * TODO verificar possibilidade de ser mais de um veículo.
   *
   * @type {string}
   * @memberof IExcursion
   */
  vehicleId: string

  /**
   * Dados do veículo da excursão.
   *
   * @type {IVehicle}
   * @memberof IExcursion
   */
  vehicle?: IVehicle

  /**
   * Valor das passagens.
   *
   * @type {number}
   * @memberof IExcursion
   */
  value: number
}
