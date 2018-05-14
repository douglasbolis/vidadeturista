import { IBaseModel, IDAO, IDAOController, INextFunction, IRequest, IResponse, IResultSearch } from '../interfaces'

/**
 * Classe base dos controllers.
 * 
 * @export
 * @class DAOController
 * @implements {IDAOController<T>}
 * @template T Tipo generalizado.
 */
export class DAOController< T extends IBaseModel > implements IDAOController< T > {
  collection: IDAO< T >
  constructor ( collection: IDAO< T > ) {
    this.collection = collection
  }

  /**
   * Busca os dados do registro.
   * 
   * @param {IRequest} req Requisição.
   * @param {IResponse} res Resposta
   * @param {INextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< T >} Os dados do registro encontrado.
   * @memberof DAOController
   */
  public find ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< T > {
    return this.collection.find( req.params.id, req.user )
      .then( ( result: T ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Busca todos os registros.
   * 
   * @param {IRequest} req Requisição.
   * @param {IResponse} res Resposta.
   * @param {INextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< Array< T > >} Array com os dados de todos os registros encontrados.
   * @memberof DAOController
   */
  public findAll ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< Array< T > > {
    return this.collection.findAll( req.query, req.user )
      .then( ( result: Array< T > ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Cria um novo registro.
   * 
   * @param {IRequest} req Requisição.
   * @param {IResponse} res Resposta.
   * @param {INextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< T >} Os dados do novo registro.
   * @memberof DAOController
   */
  public create ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< T > {
    return this.collection.create( req.body, req.user )
      .then( ( result: T ) => this.setStatusAndReturn( res, 201, result ) )
  }

  /**
   * Atualiza os dados do registro.
   * 
   * @param {IRequest} req Requisição.
   * @param {IResponse} res Resposta.
   * @param {INextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< T >} Os dados atualizados do registro.
   * @memberof DAOController
   */
  public update ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< T > {
    return this.collection.update( req.params.id, req.user, req.body )
    .then( ( result: T ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Remove o registro.
   * 
   * @param {IRequest} req Requisição.
   * @param {IResponse} res Resposta.
   * @param {INextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< boolean >} Booleano indicando o sucesso da operação.
   * @memberof DAOController
   */
  public delete ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< boolean > {
    return this.collection.delete( req.params.id, req.user )
      .then( ( result: boolean ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Busca paginada dos registros.
   * 
   * @param {IRequest} req requisição.
   * @param {IResponse} res Resposta.
   * @param {INextFunction} [next] Função intermediária para a chamada da próxima pilha de execução.
   * @returns {Promise< IResultSearch< T > >} Os dados paginados com o total de registros e número da página.
   * @memberof DAOController
   */
  public query ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< IResultSearch< T > > {
    return this.collection.paginatedQuery( req.body, req.user, req.query.page, req.query.limit )
      .then( ( result: IResultSearch< T > ) => this.setStatusAndReturn( res, 200, result ) )
  }

  /**
   * Padronização de resposta da requisição.
   * 
   * @private
   * @param {IResponse} res Resposta.
   * @param {number} status Status da resposta.
   * @param {*} data Dados de resposta.
   * @returns {Promise< any >} Resposta padronizada.
   * @memberof DAOController
   */
  private setStatusAndReturn ( res: IResponse, status: number, data: any ): Promise< any > {
    res.status( status )
    return data
  }
}
