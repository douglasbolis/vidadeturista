import { IBaseModel } from '.'

export interface IBaseUser extends IBaseModel {
  /**
   * Nome do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  name: string
  
  /**
   * Alias da empresa so usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  companyAlias: string
  
  /**
   * Email do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  email: string
  
  /**
   * Username do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  username: string
  
  /**
   * Senha do usuário.
   * 
   * @type {string}
   * @memberof IBaseUser
   */
  password: string
  
  /**
   * Flag para verificação de administrador.
   * Se _true_ o usuário é administrador do sistema.
   * 
   * @type {boolean}
   * @memberof IBaseUser
   */
  isAdmin: boolean
}
