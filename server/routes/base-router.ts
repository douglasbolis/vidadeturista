import { APIError } from '../services/api-error'
import { IResponse } from '../interfaces'

/**
 * Class base router.
 * 
 * @export
 * @class BaseRouter
 */
export class BaseRouter {
  /**
   * Método de padronização das respostas das requisições REST.
   * 
   * @param {Promise< any >} t
   * @param {IResponse} res
   * @returns {Promise< IResponse >} 
   * @memberof BaseRouter
   */
  public respond ( t: Promise< any >, res: IResponse ): Promise< IResponse > {
    return t
      .then( ( u ) => res.json( u ) )
      .catch( ( err: APIError ) => {
        console.log( err.stack )
        return res.status( err.statusCode >= 100 && err.statusCode < 600 ? err.statusCode : 500 ).json( { error: err.error, objectResponse: err.objectResponse } )
      } )
  }
}
