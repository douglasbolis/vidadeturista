import { IBaseModel } from '.'

export interface IBaseUser extends IBaseModel {
  /**
   * Primeiro nome do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  firstname: string

  /**
   * Último nome do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  lastname: string
  
  /**
   * Alias da empresa so usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  companyAlias?: string
  
  /**
   * Username do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  username: string
  
  /**
   * Email do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  email: string
  
  /**
   * Senha do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  password: string

  /**
   * Tipo do usuário.
   *
   * @type {ETypeUser}
   * @memberOf IUser
   */
  type: ETypeUser
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
