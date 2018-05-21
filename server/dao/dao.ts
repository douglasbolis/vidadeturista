import { IDAO, IResultSearch, IUser } from '../interfaces'
import { APIError } from '../services'
import { AppConfig } from '../config'
import * as JSData from 'js-data'
import * as _ from 'lodash'

/**
 * Class Generic DAO.
 * 
 * @export
 * @class DAO
 * @implements {IDAO<T>}
 * @template T Tipo generalizado.
 */
export class DAO< T > implements IDAO< T > {
  collection: JSData.Mapper
  schema: JSData.Schema
  collectionName: string
  appConfig: AppConfig
  opts: any
  constructor ( store: JSData.DataStore, appConfig: AppConfig, collectionName: string, schema: any = null, relations: any = null, joins: string[] = [] ) {
    if ( !store ) {
      throw Error( 'store is not defined' )
    }

    const mainSchemaProperties: Object = {
      id: {
        description: 'The unique identifier for a register',
        type: 'string'
      },
      active: {
        description: 'The register is active?',
        type: 'boolean'
      },
      createdAt: {
        description: 'Date of created time',
        type: 'string'
      },
      updatedAt: {
        description: 'Date of last update',
        type: 'string'
      }
    }
    this.appConfig = appConfig
    this.collectionName = collectionName

    if ( schema ) {
      const mainSchemaRequireds: Array< string > = [ 'id', 'active', 'createdAt' ]
      const newSchemaRequireds = ( schema.required && Array.isArray( schema.required ) && schema.required.length > 0 ) ? _.union( schema.required, mainSchemaRequireds ) : mainSchemaRequireds
      const newSchemaProperties = { ...mainSchemaProperties, ...schema.properties }
      const objSchema = {
        title: schema.title || this.collectionName,
        description: schema.description || 'please add description',
        type: schema.type || 'object',
        properties: newSchemaProperties,
        required: newSchemaRequireds
      }
      this.schema = new JSData.Schema( objSchema )
    }

    // Pegando/Instanciando a collection.
    try {
      this.collection = store.getMapper( collectionName )
    } catch ( e ) {
      const opts: any = {}
      if ( schema ) {
        opts.schema = this.schema
      }
      if ( relations ) {
        opts.relations = relations
      }
      this.collection = store.defineMapper( collectionName, { ...opts, ...{ collection: collectionName } } )
    }

    this.opts = {
      with: joins,
      debug: true
    }
  }

  /**
   * Método normalizador de criação dos objetos dos models.
   *
   * @param {T} obj Dados para criação do objeto.
   * @returns {T}
   *
   * @memberOf DAO
   */

  public parseModel ( obj: T ): T {
    throw new Error( 'not implemented' )
  }

  /**
   * Busca todos os registros.
   * 
   * @param {Object} [query={}] Objeto com os filtros específicos.
   * @param {IUser} authUser Usuário executando a operação.
   * @returns {Promise< Array< T > >} 
   * @memberof DAO
   */
  public findAll ( query: Object = {}, authUser: IUser ): Promise< Array< T > > {
    const filterActive: any = { where: { active: true } }
    return this.collection.findAll( { ...query, ...filterActive }, this.opts )
      .then( ( records: Array< JSData.Record > ) => records.map( d => d.toJSON( this.opts ) ) as Array< T > )
  }

  /**
   * Busca o registro pela id.
   *
   * @param {string} id Id do registro.
   * @param {IUser} authUser Usuário executando a operação.
   * @returns {Promise< T >} Dados do registro.
   *
   * @memberOf DAO
   */
  public find ( id: string, authUser: IUser ): Promise< T > {
    return this.collection.find( id, this.opts )
      .then( ( record: JSData.Record ) => record ? record.toJSON( this.opts ) as T : null )
  }
  
  /**
   * Cria um novo registro.
   * 
   * @param {T} obj Dados do novo registro.
   * @param {IUser} authUser Usuário exxecutando a operação.
   * @returns {Promise< T >} Dados do novo registro.
   * @memberof DAO
   */
  public create ( obj: T, authUser: IUser ): Promise< T > {
    try {
      return this.collection.create( this.parseModel( obj ) )
        .then( ( record: JSData.Record ) => record.toJSON( this.opts ) )
        .catch( ( reject: JSData.SchemaValidationError[] ) => {
          throw new APIError( 'Erro de entrada dos dados.', 400, reject )
        } )
    } catch ( e ) {
      return Promise.reject( new APIError( 'Erro de implementacao da classe', 500, { message: e.message } ) )
    }
  }
  
  /**
   * Altera os dados do registro.
   * 
   * @param {string} id Id do registro.
   * @param {IUser} authUser Usuário executando a operação.
   * @param {T} obj Dados a serem atualizados.
   * @returns {Promise< T >} Dados atualizados do registro.
   * @memberof DAO
   */
  public update ( id: string, authUser: IUser, obj: T ): Promise< T > {
    return this.collection.update( id, obj )
      .then( ( record: JSData.Record ) => record.toJSON( this.opts ) as T )
      .catch( ( reject: JSData.SchemaValidationError ) => {
        throw new APIError( 'Erro de entrada dos dados.', 400, reject )
      } )
  }
  
  /**
   * Remove o registro desativando-o.
   * O campo _active_ será setado para false indicando que o registro não está em uso.
   * 
   * @param {string} id Id do registro.
   * @param {IUser} authUser Usuário executando a operação.
   * @returns {Promise< boolean >} Booleano indicando o sucesso da operação.
   * @memberof DAO
   */
  public delete ( id: string, authUser: IUser ): Promise< boolean > {
    return this.collection.update( id, { active: false } )
      .then( () => true )
  }
  
  /**
   * Realiza a paginação dos registros.
   * 
   * @param {*} search Objeto com o filtro específico.
   * @param {IUser} authUser Usuário executando a operação.
   * @param {number} [page] Número da página.
   * @param {number} [limit] Quantidade de registros por página.
   * @param {Array< string >} [order] Ordenação dos registros.
   * @param {*} [options] Objeto de joins dos registros.
   * @returns {Promise< IResultSearch< T > >} Registros paginados.
   * @memberof DAO
   */
  public paginatedQuery ( search: any, authUser: IUser, page?: number, limit?: number, order?: Array< string >, options?: any ): Promise< IResultSearch< T > > {
    const filterActive: any = { where: { active: true } }
    const _page: number = search.page || page || 1
    const _limit: number = search.limit || limit || 10
    // A ordenação dos registros pode ser das seguintes formas:
    // - Ascendente:
    // · Somente o nome do campo: 'firstname'
    // · Array com alguns campos: [ 'firstname' ]
    // - Ascendente ou Descendente:
    // · Array com alguns campos: [ [ 'firstname', 'ASC' ], [ 'lastname', 'DESC' ] ]
    const _order: string | Array< any > = search.order || order || 'createdAt'
    const params = {
      ...search,
      ...filterActive,
      ...{
        orderBy: _order,
        offset: _limit * ( _page - 1 ),
        limit: _limit
      }
    }

    return Promise.all( [
      this.collection.findAll( search ),
      this.collection.findAll( params, options || this.opts )
    ] )
      .then( ( [ countResult, results ] ) => {
        return {
          page: _page,
          total: countResult.length,
          result: results.map( ( d: JSData.Record ) => d.toJSON( options || this.opts ) )
        }
      } )
  }

  /**
   * Através do _fieldsNotUp_ um novo objeto é formado e somente os campos que **NÃO** pertence a ele serão atualizados.
   * Ou seja, permitindo que campos que não podem ser alterados fiquem seguros e inalterados na atualização.
   *
   * @protected
   * @param {*} obj Dados para atualização.
   * @param {Array< string >} fieldsNotUp Array com os campos que não serão atualizados.
   * @returns {T}
   *
   */
  protected fieldsUpValidator ( obj: any, fieldsNotUp: Array< string > ): T {
    const newObj: any = {}
    const fieldsObj: Array< string > = Object.keys( obj )

    fieldsObj
      .map( ( field: string ) => {
        if ( !_.includes( fieldsNotUp, field ) ) {
          newObj[ field ] = obj[ field ]
        }
      } )

    return newObj
  }

}
