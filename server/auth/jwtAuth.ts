import { AppConfig } from '../config'

/**
 *Classe para a autenticação do usuário.
 *
 * @export
 * @class Auth
 */
export class Auth {
  /**
   * Método de verificação da autenticidade do usuário.
   *
   * @static
   * @param {*} passport Definição do passport.
   * @param {AppConfig} appConfig Objeto com os dados para validação do token no header da requisição.
   * @returns {*}
   * @memberof Auth
   */
  public static authenticate ( passport: any, appConfig: AppConfig ): any {
    return passport.authenticate( appConfig.getJwtConfig().strategy, appConfig.getJwtConfig().session )
  }
}
