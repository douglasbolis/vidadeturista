import { IResultSearch, IUser } from '.'

/**
 * Interface de generalização para as classes interação com o banco de dados.
 * 
 * @export
 * @interface IDAO
 * @template T Variável de generalização que representa o tipo generico.
 */
export interface IDAO< T > {
  /**
   * Busca os dados do registro do tipo T pela id.
   * 
   * @param {string} id Id do registro.
   * @param {IUser} user Usuário executando a operação.
   * @param {*} [options] 
   * @returns {Promise< T >} Dados do usuário requerido.
   * @memberof IDAO
   */
  find ( id: string, user: IUser, options?: any ): Promise< T >
  
  /**
   * Busca todos os registros do tipo T.
   * 
   * @param {Object} query Objeto com os dados de filtro para busca mais rica.
   * @param {IUser} user Usuário executando a operação.
   * @param {*} [options] 
   * @returns {Promise< Array< T > >} Array com os dados dos registros requeridos.
   * @memberof IDAO
   */
  findAll ( query: Object, user: IUser, options?: any): Promise< Array< T > >
  
  /**
   * Insere um registro do tipo T no banco de dados.
   * 
   * @param {T} t Dados do registro a serem inseridos.
   * @param {IUser} user Usuário executando a operação.
   * @param {*} [options] 
   * @returns {Promise< T >} Dados do registro inserido.
   * @memberof IDAO
   */
  create ( t: T, user: IUser, options?: any): Promise< T >
  
  /**
   * Atualiza os dados do registro do tipo T pela id.
   * 
   * @param {string} id Id do registro.
   * @param {IUser} user Usuário executando a operação.
   * @param {T} t 
   * @returns {Promise< T >} Dados atualizados do registro.
   * @memberof IDAO
   */
  update ( id: string, user: IUser, t: T): Promise< T >
  
  /**
   * Remove o registro do tipo T do banco de dados pela id.
   * 
   * @param {string} id Id do registro.
   * @param {IUser} user Usuário executendo a operação.
   * @returns {Promise< boolean >} Booleando indicando a realização da ação.
   * @memberof IDAO
   */
  delete ( id: string, user: IUser): Promise< boolean >
  
  /**
   * Pagina os registro do tipo T.
   * 
   * @param {Object} search Dados da busca paginada.
   * @param {IUser} user Usuário executando a operação.
   * @param {number} [page] Número da página.
   * @param {number} [limit] Número de registros por página.
   * @param {Array< string >} [order] Ordenação dos registros.
   * @param {*} [options] 
   * @returns {Promise< IResultSearch< T > >} Dados paginados dos registros.
   * @memberof IDAO
   */
  paginatedQuery ( search: Object, user: IUser, page?: number, limit?: number, order?: Array< string >, options?: any ): Promise< IResultSearch< T > >
}
