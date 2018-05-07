import { IBaseModel } from '../interfaces/ibase-model'
import { IBaseUser } from '../interfaces/ibase-user'
import { IDAO, IResultSearch } from '../interfaces'
import { APIError } from '../services'
import * as JSData from 'js-data'
import * as _ from 'lodash'

/**
 * Foi projetado a classe para ser operada como classe generica para ser aplicavel em qualquer classe de persistencia, de forma montar as seguintes operacoes
 *
 * - buscar todos
 * - buscar por id
 * - inserir
 * - alterar
 * - deletar
 * - fazer uma busca paginada
 *
 * os metodos buscar todos ( findAll ) e query paginada (paginatedQuery) utilizam do sistema de sintaxe de query de busca do js-data, para mais detalhes de como utilizar,
 * entre no seguinte link:
 *
 * http://www.js-data.io/docs/query-syntax
 * @export
 * @class DAO
 * @implements {IDAO<T>}
 * @template T
 */
/**
 * Class Generic DAO.
 * 
 * @export
 * @class DAO
 * @implements {IDAO<T>}
 * @template T Tipo generalizado.
 */
export class DAO< T extends IBaseModel > implements IDAO< T > {
  public collection: JSData.Mapper
  public schema: JSData.Schema
  public collectionName: string
  public opts: any
  constructor ( store: JSData.DataStore, collectionName: string, schema: any = null, relations: any = null, joins: string[] = [] ) {
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
    this.collectionName = collectionName

    if ( schema ) {
      let mainSchemaRequireds: Array< string > = [ 'id', 'active', 'createdAt' ]
      let newSchemaRequireds = ( schema.required && Array.isArray( schema.required ) && schema.required.length > 0 ) ? _.union( schema.required, mainSchemaRequireds ) : mainSchemaRequireds
      let newSchemaProperties = { ...mainSchemaProperties, ...schema.properties }
      let objSchema = {
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
      let opts: any = {}
      if ( schema ) {
        opts.schema = this.schema
      }
      if ( relations ) {
        opts.relations = relations
      }
      this.collection = store.defineMapper( collectionName, opts )
    }

    this.opts = {
      with: joins,
      debug: true
    }
  }

  /**
   * Método normalizador de criação dos objetos dos models.
   *
   * @param {T} val Dados para criação do objeto.
   * @returns {T}
   *
   * @memberOf DAO
   */

  public parseModel ( val: T ): T {
    throw new Error( 'not implemented' )
  }

  /**
   * Busca todos os registros.
   * 
   * @param {Object} [query={}] Objeto com os filtros específicos.
   * @param {IBaseUser} user Usuário executando a operação.
   * @returns {Promise< Array< T > >} 
   * @memberof DAO
   */
  public findAll ( query: Object = {}, user: IBaseUser ): Promise< Array< T > > {
    return this.collection.findAll( query, this.opts )
      .then( ( records: Array< JSData.Record > ) => records.map( d => d.toJSON( this.opts ) ) as Array< T > )
  }

  /**
   * Busca o registro pela id.
   *
   * @param {string} id Id do registro.
   * @param {IBaseUser} user Usuário executando a operação.
   * @returns {Promise< T >} Dados do registro.
   *
   * @memberOf DAO
   */
  public find ( id: string, user: IBaseUser ): Promise< T > {
    return this.collection.find( id, this.opts )
      .then( ( record: JSData.Record ) => record ? record.toJSON( this.opts ) as T : null )
  }
  
  /**
   * Cria um novo registro.
   * 
   * @param {T} obj Dados do novo registro.
   * @param {IBaseUser} user Usuário exxecutando a operação.
   * @returns {Promise< T >} Dados do novo registro.
   * @memberof DAO
   */
  public create ( obj: T, user: IBaseUser ): Promise< T > {
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
   * @param {IBaseUser} user Usuário executando a operação.
   * @param {T} obj Dados a serem atualizados.
   * @returns {Promise< T >} Dados atualizados do registro.
   * @memberof DAO
   */
  public update ( id: string, user: IBaseUser, obj: T ): Promise< T > {
    return this.collection.update( id, obj )
      .then( ( record: JSData.Record ) => record.toJSON( this.opts ) as T )
      .catch(( reject: JSData.SchemaValidationError ) => {
        throw new APIError( 'Erro de entrada dos dados.', 400, reject )
      } )
  }
  
  /**
   * Remove o registro.
   * 
   * @param {string} id Id do registro.
   * @param {IBaseUser} user Usuário executando a operação.
   * @returns {Promise< boolean >} Booleano indicando o sucesso da operação.
   * @memberof DAO
   */
  public delete ( id: string, user: IBaseUser ): Promise< boolean > {
    return this.collection.destroy( id )
      .then( ( response ) => true )
  }

  paginatedQuery ( search: Object, user: IBaseUser, page?: number, limit?: number, order?: Array<string>, options?: any ): Promise< IResultSearch< T > > {
    let _page: number = page || 1
    let _limit: number = limit || 10
    let _order: string[] = []
    let params = Object.assign( {}, search, {
      orderBy: _order,
      offset: _limit * ( _page - 1 ),
      limit: _limit
    } )

    return this.collection.findAll( search )
      .then(( countResult ) => {
        return this.collection.findAll( params, options || this.opts )
          .then(( results: JSData.Record[] ) => {
            return {
              page: _page,
              total: countResult.length,
              result: results.map( d => d.toJSON( options || this.opts ) )
            } as IResultSearch<T>
          } )
      } )
  }

}
