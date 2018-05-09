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
}
