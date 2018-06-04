/**
 * Interface para os endereços das entidades.
 *
 * @export
 * @interface IAddress
 */
export interface IAddress {
  /**
   * Latitude do endereço.
   *
   * @type {number}
   * @memberof IAddress
   */
  latitude?: number

  /**
   * Longitude do endereço.
   *
   * @type {number}
   * @memberof IAddress
   */
  longitude?: number

  /**
   * Cep.
   *
   * @type {string}
   * @memberOf IAddress
   */
  zipCode: string

  /**
   * Endereço rua ou avenida.
   *
   * @type {string}
   * @memberOf IAddress
   */
  address: string

  /**
   * Número.
   *
   * @type {string}
   * @memberOf IAddress
   */
  number: string

  /**
   * Complemento para o endereço.
   *
   * @type {string}
   * @memberOf IAddress
   */
  complement: string

  /**
   * Bairro.
   *
   * @type {string}
   * @memberOf IAddress
   */
  neighbor: string

  /**
   * Cidade.
   *
   * @type {string}
   * @memberOf IAddress
   */
  city: string

  /**
   * Estado.
   *
   * @type {string}
   * @memberOf IAddress
   */
  state: string

  /**
   * País.
   *
   * @type {string}
   * @memberOf IAddress
   */
  country: string
}