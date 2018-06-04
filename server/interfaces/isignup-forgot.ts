/**
 * Interface para os completes de cadastro e resets de senha.
 * 
 * @export
 * @interface ISignupForgot
 */
export interface ISignupForgot {
  /**
   * Endereço de email para o envio do link para completar registro ou resetar a senha.
   * 
   * @type {string}
   * @memberof ISignupForgot
   */
  email: string
}
