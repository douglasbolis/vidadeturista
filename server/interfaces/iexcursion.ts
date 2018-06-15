import { IAddress, IBaseModel, IVehicle } from '.'

/**
 * Interface para as exercursões com as descrições de seus atributos.
 *
 * @export
 * @interface IExcursion
 * @extends {IBaseModel}
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
   * Id dos veículos da excursão.
   * TODO verificar possibilidade de ser mais de um veículo.
   *
   * @type {Array< string >}
   * @memberof IExcursion
   */
  vehiclesId: Array< string >

  /**
   * Dados dos veículos da excursão.
   *
   * @type {Array< IVehicle >}
   * @memberof IExcursion
   */
  vehicles?: Array< IVehicle >

  /**
   * Valor das passagens.
   *
   * @type {number}
   * @memberof IExcursion
   */
  value: number

  /**
   * Valor gasto com combustível.
   *
   * @type {number}
   * @memberof IExcursion
   */
  fuel: number

  /**
   * A excursão terá lanche durante a viagem(percurso)?
   *
   * @type {boolean}
   * @memberof IExcursion
   */
  snack: boolean

  /**
   * A excursão terá café-da-manhã no hotel?
   *
   * @type {boolean}
   * @memberof IExcursion
   */
  breakfast: boolean

  /**
   * A excursão terá almoço no hotel?
   *
   * @type {boolean}
   * @memberof IExcursion
   */
  lunch: boolean

  /**
   * A excursão terá jantar no hotel?
   *
   * @type {boolean}
   * @memberof IExcursion
   */
  dinner: boolean
}
