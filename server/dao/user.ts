import { ETypeUser, IResultSearch, IUser } from '../interfaces'
import { ServiceLib } from '../services'
import { AppConfig } from '../config'
import { User } from '../models'
import { DAO } from '.'
import * as JSData from 'js-data'
import * as _ from 'lodash'

export class UserDAO extends DAO< IUser > {
  serviceLib: ServiceLib
  appConfig: AppConfig
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    const collectionName: string = appConfig.getUsersTable()
    const schema = {
      type: 'object',
      properties: {
        firstname: { type: 'string' },
        lastname: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        type: {
          type: 'number',
          minimum: 0
        },
        typePerson: {
          type: 'number',
          minimum: 0
        },
        numDocFed: { type: 'string' },
        phones: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: {
                type: 'number',
                minimum: 0
              },
              phone: { type: 'string' }
            },
            required: [ 'type', 'phone' ]
          },
          minItems: 1
        },
        photo: { type: 'string' },
        dateBirth: { type: 'string' },
        zipCode: { type: 'string' },
        address: { type: 'string' },
        number: { type: 'string' },
        complement: { type: 'string' },
        neighbor: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        country: { type: 'string' }
      },
      required: [ 'firstname', 'lastname', 'username', 'email', 'password', 'type', 'typePerson', 'numDocFed', 'phones', 'dateBirth' ]
    }
    const relations: any = null
    const joins: Array< string > = []
    super( store, appConfig, collectionName, schema, relations, joins )
    this.serviceLib = new ServiceLib( appConfig )
  }

  /**
   * Método para para facilitar a criação dos usuários
   *
   * @param {*} val
   * @returns {IUser}
   *
   * @memberOf UserDAO
   */
  public parseModel ( val: IUser ): IUser {
    return new User( val )
  }

  /**
   * Busca os dados do usuário.
   *
   * @param {string} id Id do usuário.
   * @param {IUser} authUser Usuário executando a operação.
   * @returns {Promise< IUser >}
   * @memberof UserDAO
   */
  public find ( id: string, authUser: IUser ): Promise< IUser > {
    return super.find( id, authUser )
      .then( ( user: IUser ) => {
        if ( authUser.type !== ETypeUser.ADMIN && authUser.id !== user.id ) {
          if ( user.type === ETypeUser.ADMIN || user.type === ETypeUser.EMPLOYEE ||
            ( user.type === ETypeUser.DEFAULT && authUser.type === ETypeUser.DEFAULT )
          ) {
            return ServiceLib.callMessageError( 'Não foi possível buscar o usuário.', 403 )
          }
        }
        return user
      } )
  }

  /**
   * Busca todos os usuários.
   *
   * @param {Object} [query={}] Filtro da busca.
   * @param {IUser} authUser Usuário executando a operação.
   * @returns {Promise< Array< IUser > >}
   * @memberof UserDAO
   */
  public findAll ( query: Object = {}, authUser: IUser ): Promise< Array< IUser > > {
    return super.findAll( query, authUser )
      .then( ( users: Array< IUser > ) => {
        if ( authUser.type !== ETypeUser.ADMIN ) {
          _.remove( users, user => user.type !== ETypeUser.DEFAULT )
        }
        return users
      } )
  }

  /**
   * Cria e insere um usuário.
   *
   * @param {IUser} obj Dados do novo usuário.
   * @param {IUser} authUser Usuário executando a operação.
   * @returns {Promise< IUser >}
   *
   * @memberOf UserDAO
   */
  public create ( obj: IUser, authUser: IUser ): Promise< IUser > {
    const data: IUser = new User( obj )
    const dataValidate: Array< JSData.SchemaValidationError > = this.schema.validate( data )

    // Filtro para buscar os usuários com os mesmos email e documentos.
    const filterUsers: any = {
      where: {
        numDocFed: { '|===': data.numDocFed },
        email: { '|===': data.email }
      }
    }

    return super.findAll( filterUsers, authUser )
      .then( ( users: Array< IUser >) => {
        if ( authUser.type !== ETypeUser.ADMIN ) {
          return ServiceLib.callMessageError( 'Sem permissão para inserir o usuário.', 403 )
        } else
        if ( dataValidate ) {
          return ServiceLib.callMessageError( 'Erro de entrada nos dados do usuário.', 400, dataValidate )
        } else
        if ( users.length ) {
          return ServiceLib.callMessageError( 'O documento e/ou email já pertence a outro usuário.', 400 )
        } else
        if ( !ServiceLib.cpfCnpjValidator( data.numDocFed, data.typePerson ) ) {
          return ServiceLib.callMessageError( 'O documento oficial do usuário não é válido.', 400 )
        } else
        if ( !ServiceLib.emailValidator( data.email ) ) {
          return ServiceLib.callMessageError( 'O email do usuário não é válido.', 400 )
        }

        // TODO remover a linha a abaixo quando as telas de cadastro de senha e forgot estiverem funcionando.
        obj.password = ServiceLib.hashPassword( 'asd123' )

        return super.create( obj, authUser )
      } )
  }
  
  /**
   * Atualiza os dados do usuário.
   * 
   * @param {string} id Id do usuário.
   * @param {IUser} authUser Usuério executando a operação.
   * @param {IUser} obj Objeto com os dados a serem atualizados.
   * @returns {Promise< IUser >} Dados do usuário atualizados.
   * @memberof UserDAO
   */
  public update ( id: string, authUser: IUser, obj: IUser ): Promise< IUser > {
    const fieldsNotUp: Array< string > = [ 'id', 'active', 'createdAt', 'numDocFed', 'email', 'type', 'typePerson', 'password' ]
    const data: IUser = this.fieldsUpValidator( obj, fieldsNotUp )

    // Filtros para verificar a alteração do email do usuário.
    const filterUserEmail: any = {
      where: {
        id: { 'notIn': [ id ] },
        email: { '|===': obj.email || '' },
        numDocFed: { '|===': obj.numDocFed || '' }
      }
    }

    return Promise.all( [
      this.find( id, authUser ),
      super.findAll( filterUserEmail, authUser )
    ] )
      .then( ( [ user, users ] ) => {
        if ( authUser.type !== ETypeUser.ADMIN && authUser.id === user.id ) {
          return ServiceLib.callMessageError( 'Não foi possível atualizar o usuário.', 403 )
        }
        // Sobreescrevendo dados do usuário para validação.
        user = { ...user, ...data }
        // Validando os dados do usuário após a sobreescrita.
        const dataValidate: Array< JSData.SchemaValidationError > = this.schema.validate( user )
        // Verificando se houve alguma inconsistência com os dados sobreescritos.
        if ( dataValidate ) {
          return ServiceLib.callMessageError( 'Erro de entrada na atualização do usuário.', 400, dataValidate )
        }
        // Verificando se o email será atualizado e se ele já pertence a outro usuário (exceto a ele mesmo)
        if ( _.isString( obj.email ) ) {
          if ( users.length ) {
            return ServiceLib.callMessageError( 'O novo email já pertence a outro usuário.', 400 )
          } else
          if ( !ServiceLib.emailValidator( obj.email ) ) {
            return ServiceLib.callMessageError( 'O novo email do usuário não é válido.', 400 )
          }
          data.email = obj.email
        }

        return super.update( id, user, data )
      } )
  }

  /**
   * Remove o usuário pela id.
   *
   * @param {string} id Id do usuário.
   * @param {IUser} authUser Usuário executando a operação.
   * @returns {Promise< boolean >} Booleano indicando o sucesso da operação.
   * @memberof EvidenceDAO
   */
  public delete ( id: string, authUser: IUser ): Promise< boolean > {
    if ( authUser.type !== ETypeUser.ADMIN ) {
      return ServiceLib.callMessageError( 'Não foi possível remover o usuário.', 403 )
    }
    return super.delete( id, authUser )
  }

  /**
   * Busca paginada dos usuários.
   * 
   * @param {*} search Objeto de filtro.
   * @param {IUser} authUser Usuário executando a operação.
   * @param {number} [page] Número da página.
   * @param {number} [limit] Quantidade de registros na página.
   * @param {Array< string >} [order] Ordenação dos registros.
   * @param {*} [options] Objeto com os joins dos registros.
   * @returns {Promise< IResultSearch< IUser > >} Usuários paginados.
   * @memberof UserDAO
   */
  public paginatedQuery ( search: any, authUser: IUser, page?: number, limit?: number, order?: Array< string >, options?: any ): Promise< IResultSearch< IUser > > {
    const _page: number = search.page || page || 1
    const _limit: number = search.limit || limit || 10
    const _order: string[] = search.orderBy || []

    const params = {
      ...search,
      ...{ orderBy: _order }
    }

    const pagination = ( users: Array< IUser > ) => _.slice( users, _limit * ( _page - 1 ), _limit * _page )

    return this.findAll( params, authUser )
      .then( ( users: Array< IUser > ) => {
        return {
          page: _page,
          total: users.length,
          result: pagination( users )
        }
      } )
  }
}
