import { IBaseUser } from '.'

/**
 * Interface para usuário com as descrições de seus atributos.
 *
 * @export
 * @interface IUser
 * @extends {IAddress}
 */
export interface IUser extends IBaseUser, IAddress {
  /**
   * Tipo do usuário.
   *
   * @type {ETypeUser}
   * @memberOf IUser
   */
  type: ETypeUser

  /**
   * Tipo de pessoa do usuário.
   * 
   * @type {ETypePerson}
   * @memberof IUser
   */
  typePerson: ETypePerson

  /**
   * Número do documento.
   * Dependendo do _typePerson_ será cpf ou cnpj.
   *
   * @type {string}
   * @memberOf IUser
   */
  numDocFed: string

  /**
   * Telefone fixo.
   *
   * @type {Array< IPhone >}
   * @memberOf IUser
   */
  phones: Array< IPhone >

  /**
   * Foto do usuário.
   * TODO Avaliar se manterá o campo.
   *
   * @type {string}
   * @memberOf IUser
   */
  photo: string

  /**
   * Data de nascimento do usuário.
   *
   * @type {string}
   * @memberOf IUser
   */
  dateBirth: string
}

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

export interface IPhone {
  /**
   * Tipo do telefone.
   * 
   * @type {ETypePhone}
   * @memberof IPhone
   */
  type: ETypePhone
  
  /**
   * Número do telefone.
   * 
   * @type {string}
   * @memberof IPhone
   */
  phone: string
}

/**
 * Enum para o tipo de usuário.
 *
 * @export
 * @enum {number}
 */
export enum ETypeUser {
  /**
   * Admin.
   */
  ADMIN,
  
  /**
   * Funcionário.
   */
  EMPLOYEE,

  /**
   * Usuário padrão.
   * Usuário, cliente, passageiro...
   */
  DEFAULT
}

export enum ETypePerson {
  /**
   * Pessoa física.
   */
  INDIVIDUAL,

  /**
   * Pessoa jurídica.
   */
  ENTERPRISE
}

export enum ETypePhone {
  /**
   * Telefone fixo.
   */
  LANDLINE,
  
  /**
   * Telefone celular.
   */
  MOBILE
}

export enum ETypeMail {
  /**
   * Signup.
   */
  confirmation,
  /**
   * Esqueceu senha.
   */
  forgot
}
