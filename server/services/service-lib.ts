import { AppConfig } from '../config/app-config'
import { APIError } from '../services/api-error'
import * as EmailValidator from 'email-validator'
import * as shortid from 'shortid'
import * as crypto from 'crypto'

/**
 * shortid config chars
 */
shortid.characters( '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@' )

/**
 * Classe com metodos auxiliares genéricos utilizados em outras classes
 * muitas dessas classes estão disponiveis para atender funcoes de criptografia.
 *
 * Ela deve ser aplicada dentro da lib em uma aplicação definida, e com a configuração feita
 * a unica exigencia na configuracao para plena execucao dessa lib é a configuracao de algoritmo de criptografia, que é necessário para geracao de
 * tokens dos convites de usuários no sistema utilizado nas tecnicas de signup e forgot.
 *
 * @export
 * @class ServiceLib
 */
export class ServiceLib {
  config: AppConfig
  /**
   * Creates an instance of ServiceLib.
   * Essa instancia depende somente da configuracao setada na aplicacao que é encapsulado no appConfig.
   * @param {AppConfig} config
   *
   * @memberof ServiceLib
   */
  constructor ( config: AppConfig ) {
    this.config = config
  }

  /**
   * Gera uma nova id(usando algoritmo shortid).
   *
   * @returns {string} Id gerada.
   * @memberof ServiceLib
   */
  static generateId () {
    return shortid.generate()
  }

  /**
   * Valida por regexp se o email é válido.
   *
   * @param {string} email Email a ser validado.
   *
   * @returns {boolean} Booleano se o email é valido.
   * @memberof ServiceLib
   */
  static emailValidator ( email: string ): boolean {
    return EmailValidator.validate( email )
  }

  /**
   * Gera a hash da string definida em password, a saida é assincrona.
   * @static
   * @param {string} password Entrada do texto(senha, palavra chave).
   *
   * @returns {Promise<string>} Hash da senha.
   * @memberof ServiceLib
   */
  static hashPassword ( password: string ): string {
    return crypto.createHash( 'sha1' ).update( password ).digest( 'hex' )
  }

  /**
   * Analisa se a senha é valida sem necessidade de descriptografar a senha armazenada no sistema.
   *
   * @static
   * @param {string} password  valor plano ( nao criptografado ) a ser analisado
   * @param {string} encryptedPassword valor armazenado no banco que foi criptografado
   *
   * @returns {boolean} retorna verdadeiro se bater
   * @memberof ServiceLib
   */
  static comparePassword ( password: string, encryptedPassword: string ): boolean {
    return crypto.createHash( 'sha1' ).update( password ).digest( 'hex' ) === encryptedPassword
  }

  /**
   * A partir da configuracao definida na aplicação pelo appConfig teremos o algoritmo que será
   * usado na criptografia, a mesma será usado na volta na hora de recuperar o valor.
   * Nos projetos é encontrado no algoritmo para gerar token de primeiro login e recuperacao de senhas.
   *
   * @param {string} text Texto a ser aplicado criptografia.
   *
   * @returns {string} Texto criptografado.
   * @memberof ServiceLib
   */
  encrypt ( text: string ): string {
    let cipher = crypto.createCipher( this.config.getCryptoAlgorithm(), this.config.getCryptoPassword() )
    let crypted = cipher.update( text, 'utf8', 'hex' )
    crypted += cipher.final( 'hex' )
    return crypted
  }

  /**
   * Semelhante ao algoritmo citado em encrypt, aqui ele recupera o valor que foi criptografado usando a configuracao da aplicacao.
   *
   * @param {string} text texto a ser descriptografado
   *
   * @returns {string} texto descriptografado ( pode ser um objeto no qual deve aplicar JSON.parse para transformar de string para objeto)
   * @memberof ServiceLib
   */
  decrypt ( text: string ): string {
    try {
      let decipher = crypto.createDecipher( this.config.getCryptoAlgorithm(), this.config.getCryptoPassword() )
      let dec = decipher.update( text, 'hex', 'utf8' )
      dec += decipher.final( 'utf8' )
      return dec
    } catch ( e ) {
      throw new APIError( 'token inválido', 401 , { message : e.message } )
    }
  }

  /**
   * Usando o algoritmo de criptografia criamos o token com email e data de expiracao do convite.
   * Usado nas rotas de signup e recuperar senha, ele tem versatilidade de definir a data de expiracao.
   *
   * @param {string} email Email.
   * @param {Date} expireDate data de expiracao do token, se nao informar, será considerado a data do dia vigente na geracao do token como validade.
   * @param {*} customData caso queira criptografar no token um tipo de dado diferente, pode customizar usando customData que ele irá sobrepor sobre o objeto data quer irá ser criptografado.
   *
   * @returns {string} Token.
   * @memberof ServiceLib
   */
  generateToken ( email: string, expireDate?: Date, customData?: any ): string {
    let data: any = customData || { email, expiration: expireDate || new Date() }
    // Expire on confg days
    data.expiration.setDate( data.expiration.getDate() + this.config.getExpirationDays() )
    return this.encrypt( JSON.stringify( data ) )
  }
}
