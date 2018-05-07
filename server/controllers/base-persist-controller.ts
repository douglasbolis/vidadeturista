import { IDAO, IBaseModel, IResultSearch, IPersistController } from '../interfaces'
import { APIError } from '../services'
import * as express from 'express'

/**
 * Interface Request.
 */
export interface Request extends express.Request {
  authInfo?: any
  user?: any

  // These declarations are merged into express's Request type.
  login ( user: any, done: ( err: any ) => void ): void
  login ( user: any, options: any, done: ( err: any ) => void ): void
  logIn ( user: any, done: ( err: any ) => void ): void
  logIn ( user: any, options: any, done: ( err: any ) => void ): void

  logout (): void
  logOut (): void

  isAuthenticated (): boolean
  isUnauthenticated (): boolean
}

/**
 * Classe base dos controllers.
 * 
 * @export
 * @class BasePersistController
 * @implements {IPersistController<T>}
 * @template T Tipo generalizado.
 */
export class BasePersistController< T extends IBaseModel > implements IPersistController< T > {
  collection: IDAO< T >
  constructor ( collection: IDAO< T > ) {
    this.collection = collection
  }

  /**
   * Busca os dados do registro.
   * 
   * @param {Request} req Requisição.
   * @param {express.Response} res Resposta
   * @param {express.NextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< T >} Os dados do registro encontrado.
   * @memberof BasePersistController
   */
  public find ( req: Request, res: express.Response, next?: express.NextFunction ): Promise< T > {
    return this.collection.find( req.params.id, req.user )
      .then( ( result: T ) => this.setStatusAndReturn( res, 200, result ) )
      .catch( ( err : string ) => { throw new APIError( err, 400 ) } )
      .catch( ( err : Error ) => { throw new APIError( err.message, 400 ) } )
  }

  /**
   * Busca todos os registros.
   * 
   * @param {Request} req Requisição.
   * @param {express.Response} res Resposta.
   * @param {express.NextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< Array< T > >} Array com os dados de todos os registros encontrados.
   * @memberof BasePersistController
   */
  public findAll ( req: Request, res: express.Response, next?: express.NextFunction ): Promise< Array< T > > {
    return this.collection.findAll( req.query, req.user )
      .then( ( result: Array< T > ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Cria um novo registro.
   * 
   * @param {Request} req Requisição.
   * @param {express.Response} res Resposta.
   * @param {express.NextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< T >} Os dados do novo registro.
   * @memberof BasePersistController
   */
  public create ( req: Request, res: express.Response, next?: express.NextFunction ): Promise< T > {
    return this.collection.create( req.body, req.user )
      .then( ( result: T ) => this.setStatusAndReturn( res, 201, result ) )
  }

  /**
   * Atualiza os dados do registro.
   * 
   * @param {Request} req Requisição.
   * @param {express.Response} res Resposta.
   * @param {express.NextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< T >} Os dados atualizados do registro.
   * @memberof BasePersistController
   */
  public update ( req: Request, res: express.Response, next?: express.NextFunction ): Promise< T > {
    return this.collection.update( req.params.id, req.user, req.body )
    .then( ( result: T ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Remove o registro.
   * 
   * @param {Request} req Requisição.
   * @param {express.Response} res Resposta.
   * @param {express.NextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< boolean >} Booleano indicando o sucesso da operação.
   * @memberof BasePersistController
   */
  public delete ( req: Request, res: express.Response, next?: express.NextFunction ): Promise< boolean > {
    return this.collection.delete( req.params.id, req.user )
      .then( ( result: boolean ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Busca paginada dos registros.
   * 
   * @param {Request} req requisição.
   * @param {express.Response} res Resposta.
   * @param {express.NextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< IResultSearch< T > >} Os dados paginados com o total de registros e número da página.
   * @memberof BasePersistController
   */
  public query ( req: Request, res: express.Response, next?: express.NextFunction ): Promise< IResultSearch< T > > {
    return this.collection.paginatedQuery( req.body, req.user, req.query.page, req.query.limit )
      .then( ( result: IResultSearch< T > ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Padronização de resposta da requisição.
   * 
   * @private
   * @param {express.Response} res Resposta.
   * @param {number} status Status da resposta.
   * @param {*} data Dados de resposta.
   * @returns {Promise< any >} Resposta padronizada.
   * @memberof BasePersistController
   */
  private setStatusAndReturn ( res: express.Response, status: number, data: any ): Promise< any > {
    res.status( status )
    return data
  }
}
