import { IBaseModel } from '.'

export interface IVehicle extends IBaseModel {
  /**
   * Tipo do veículo.
   *
   * @type {ETypeVehicle}
   * @memberof IVehicle
   */
  type: ETypeVehicle

  /**
   * Número de assentos do veículo.
   *
   * @type {number}
   * @memberof IVehicle
   */
  numSeat: number

  /**
   * Número da placa do veículo.
   *
   * @type {string}
   * @memberof IVehicle
   */
  licensePlate: string

  /**
   * Renavam do vaículo.
   *
   * @type {string}
   * @memberof IVehicle
   */
  renavam: string

  /**
   * Tamanho do tanque de combustível do veículo.
   *
   * @type {number}
   * @memberof IVehicle
   */
  fuel: number

  /**
   * Possui banheiro?
   *
   * @type {boolean}
   * @memberof IVehicle
   */
  wc: boolean
}

export enum ETypeVehicle {
  /**
   * Ônibus.
   */
  BUS,
  /**
   * Micro-ônibus.
   */
  MINIBUS,
  /**
   * Van.
   */
  VAN,
  /**
   * Minivan.
   */
  MINIVAN
}
