import * as Boom from 'boom'

/**
 * Class APIError para a padronização das respostas com erros.
 * 
 * @export
 * @class APIError
 * @extends {Error}
 */
export class APIError extends Error {
  statusCode: number
  error: Boom.Payload
  objectResponse: Object
  constructor ( message: string, statusCode: number, objectResponse?: Object ) {
    super( message )
    this.statusCode = statusCode
    this.objectResponse = objectResponse
    this.definedBoomError()
    this.showError()
  }

  /**
   * Define o tipo do erro a partir do status do erro.
   * 
   * @private
   * @memberof APIError
   */
  private definedBoomError () {
    switch ( this.statusCode ) {
      case 400:
        this.error = Boom.badRequest( this.message ).output.payload
        break
      case 401:
        this.error = Boom.unauthorized( this.message ).output.payload
        break
      default:
        this.error = new Boom( this.message, { statusCode: this.statusCode } ).output.payload
        break
    }
  }

  /**
   * Exibe no console de debug interno os erros.
   * 
   * @private
   * @memberof APIError
   */
  private showError () {
    console.error( `API ERROR CODE: ${ this.statusCode }` )
    console.error( `API ERROR MESSAGE: ${ this.message }` )
    console.error( `API ERROR STACK: ${ this.stack }` )
  }
}
