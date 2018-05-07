import { ETypeUser, IAgenda, IUser } from '../interfaces'
import { Config, Interfaces, Models, Services } from 'js-data-dao'
import { ServiceBuilding } from '../services/service-building'
import { ServiceLib } from '../services/service-lib'
import { SendMail } from '../services/sendmail'
import { BuildingBasicDAO } from './building.basic'
import * as JSData from 'js-data'
import * as _ from 'lodash'
// import * as url from 'url'
const serviceLib: ServiceLib = new ServiceLib()
// Definindo classes de usuários.
const usersSponsored: Array< ETypeUser > = [
  ETypeUser.EQUIPMENTSUPPLIER, ETypeUser.MATERIALSUPPLIER, ETypeUser.SERVICEPROVIDER
]
const usersCompany: Array< ETypeUser > = _.concat( [
  ETypeUser.CONDOMINIUMMANAGER, ETypeUser.CONSTRUCTIONCOMPANY
], usersSponsored )
let usersAccess: Array< ETypeUser > = [
  ETypeUser.ADMIN, ETypeUser.CONDOMINIUMMANAGER, ETypeUser.DEFAULT, ETypeUser.SUBSIDY, ETypeUser.SYNDIC
]

/**
 * Model User
 *
 * @export
 * @class User
 * @extends {Models.BaseModel}
 * @implements {IUser}
 */
export class User extends Models.BaseModel implements IUser {
  name: string
  companyAlias: string
  email: string
  username: string
  password: string
  isAdmin: boolean
  tpUser: ETypeUser
  canAccess: boolean
  completed: boolean
  numDocFed: string
  phone: string
  cellPhone: string
  alternativeEmail: string
  photo: string
  createdAgendas: Array< IAgenda >
  webSite: string
  fantasyName: string
  contact: string
  startActivities: string
  creaCau: string
  inActivity: boolean
  formation: string
  company: string
  cnpj: string
  profession: string
  dateBirth: string
  zipCode: string
  address: string
  number: string
  complement: string
  neighbor: string
  city: string
  state: string
  country: string
  buildingsId: Array< string >
  lastBuildingsId: Array< string >
  activeBuildingId: string | null
  tags: Array< string >
  buildingId: string | null
  sponsored: boolean
  constructor ( obj: IUser ) {
    super( obj )
    this.name = obj.name
    this.companyAlias = obj.companyAlias
    this.username = obj.username
    this.password = obj.password
    this.numDocFed = obj.numDocFed
    this.phone = obj.phone
    this.cellPhone = obj.cellPhone
    this.email = obj.email
    this.alternativeEmail = obj.alternativeEmail
    this.zipCode = obj.zipCode
    this.address = obj.address
    this.number = obj.number || 'S/N'
    this.complement = obj.complement || null
    this.neighbor = obj.neighbor
    this.city = obj.city
    this.state = obj.state
    this.country = obj.country
    this.photo = obj.photo
    this.webSite = obj.webSite
    this.tpUser = obj.tpUser >= 0 ? obj.tpUser : ETypeUser.DEFAULT
    this.canAccess = this.defineAccess( this.tpUser )
    this.completed = !this.canAccess
    this.isAdmin = this.tpUser === ETypeUser.ADMIN
    this.dadosTpUser( obj )
  }

  /**
   * Define e retorna se o usuário pode acessar o sistema
   *
   * @private
   * @param {number} tpUser
   * @returns {boolean}
   *
   * @memberOf User
   */
  private defineAccess ( tpUser: number ): boolean {
    let whoCanNotAccess: Array< number > = [ ETypeUser.EQUIPMENTSUPPLIER, ETypeUser.MATERIALSUPPLIER,
      ETypeUser.SERVICEPROVIDER, ETypeUser.DESIGNER, ETypeUser.CONSTRUCTIONCOMPANY, ETypeUser.CONDOMINIUMMANAGER ]
    return _.indexOf( whoCanNotAccess, tpUser ) === -1
  }

  private dadosTpUser ( obj: IUser ): void {
    if ( this.tpUser === ETypeUser.CONDOMINIUMMANAGER ) {
      this.fantasyName = obj.fantasyName
      this.contact = obj.contact
      this.startActivities = obj.startActivities
    } else if ( _.indexOf( [
      ETypeUser.CONSTRUCTIONCOMPANY, ETypeUser.EQUIPMENTSUPPLIER, ETypeUser.MATERIALSUPPLIER, ETypeUser.SERVICEPROVIDER
    ], this.tpUser ) >= 0 ) {
      this.fantasyName = obj.fantasyName
      this.contact = obj.contact
      this.creaCau = obj.creaCau
      this.inActivity = obj.inActivity || true
      let tagUsers: Array< number > = [ ETypeUser.EQUIPMENTSUPPLIER, ETypeUser.MATERIALSUPPLIER, ETypeUser.SERVICEPROVIDER ]
      if ( _.indexOf( tagUsers, this.tpUser ) >= 0 ) {
        this.tags = obj.tags || []
      }
    } else if ( this.tpUser === ETypeUser.DESIGNER ) {
      this.creaCau = obj.creaCau
      this.inActivity = obj.inActivity || true
      this.formation = obj.formation
      this.company = obj.company
      this.cnpj = obj.cnpj
    } else if ( _.indexOf( [
      ETypeUser.SYNDIC, ETypeUser.SUBSIDY, ETypeUser.DEFAULT
    ], this.tpUser ) >= 0 ) {
      this.profession = obj.profession
      this.dateBirth = obj.dateBirth
      this.buildingsId = obj.buildingsId || []
      this.lastBuildingsId = obj.lastBuildingsId || []
    }
  }
}

export class UserDAO extends Models.DAO< IUser > {
  schemaUser: JSData.Schema
  serviceLib: Services.ServiceLib
  sendMail: SendMail
  buildingBasicDAO: BuildingBasicDAO
  appConfig: Config.AppConfig
  constructor ( store: JSData.DataStore, appConfig: Config.AppConfig ) {
    const collectionName: string = appConfig.getUsersTable()
    const schema = {
      type: 'object',
      properties: {
        name: { type: 'string' },
        numDocFed: { type: 'string' },
        email: { type: 'string' },
        companyAlias: { type: [ 'string', 'null' ] },
        username: { type: [ 'string', 'null' ] },
        password: { type: [ 'string', 'null' ] },
        isAdmin: { type: [ 'boolean', 'null' ] },
        tpUser: { type: [ 'number', 'null' ] },
        canAccess: { type: [ 'boolean', 'null' ] },
        completed: { type: [ 'boolean', 'null' ] },
        phone: { type: [ 'string', 'null' ] },
        cellPhone: { type: [ 'string', 'null' ] },
        alternativeEmail: { type: [ 'string', 'null' ] },
        zipCode: { type: [ 'string', 'null' ] },
        address: { type: [ 'string', 'null' ] },
        number: { type: [ 'string', 'null' ] },
        complement: { type: [ 'string', 'null' ] },
        neighbor: { type: [ 'string', 'null' ] },
        city: { type: [ 'string', 'null' ] },
        state: { type: [ 'string', 'null' ] },
        country: { type: [ 'string', 'null' ] },
        photo: { type: [ 'string', 'null' ] },
        webSite: { type: [ 'string', 'null' ] },
        fantasyName: { type: [ 'string', 'null' ] },
        contact: { type: [ 'string', 'null' ] },
        startActivities: { type: [ 'string', 'null' ] },
        creaCau: { type: [ 'string', 'null' ] },
        rrtArt: { type: [ 'string', 'null' ] },
        inActivity: { type: [ 'boolean', 'null' ] },
        formation: { type: [ 'string', 'null' ] },
        company: { type: [ 'string', 'null' ] },
        cnpj: { type: [ 'string', 'null' ] },
        discipline: { type: [ 'string', 'null' ] },
        role: { type: [ 'string', 'null' ] },
        startRole: { type: [ 'string', 'null' ] },
        endRole: { type: [ 'string', 'null' ] },
        profession: { type: [ 'string', 'null' ] },
        dateBirth: { type: [ 'string', 'null' ] },
        buildingsId: {
          type: 'array',
          items: { type: [ 'string', 'null' ] },
          uniqueItems: true
        },
        lastBuildingsId: {
          type: 'array',
          items: { type: [ 'string', 'null' ] },
          uniqueItems: true
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true
        },
        activeBuildingId: { type: [ 'string', 'null' ] },
        buildingId: { type: [ 'string', 'null' ] },
        sponsored: { type: 'boolean' }
      },
      required: [ 'name', 'email', 'numDocFed' ]
    }
    const relations = {
      belongsTo: {
        reforms: {
          localField: 'reform',
          foreignKey: 'projetistaId'
        }
      },
      hasMany: {
        agendas: {
          localField: 'createdAgendas',
          foreignKey: 'userAgendaId'
        }
      }
    }
    const joins: Array< string > = []
    super( store, collectionName, schema, relations, joins )
    this.appConfig = appConfig
    this.buildingBasicDAO = new BuildingBasicDAO( store, appConfig )
    this.schemaUser = new JSData.Schema( schema )
    this.serviceLib = new Services.ServiceLib( appConfig )
    this.sendMail = new SendMail( appConfig.mailConfig )
  }

  /**
   * Método para para facilitar a criação dos usuários
   *
   * @param {*} val
   * @returns {IUser}
   *
   * @memberOf UserDAO
   */
  public parseModel ( val: any ): IUser {
    return new User( val )
  }

  /**
   * Busca os dados do usuário.
   *
   * @param {string} id Id do usuário.
   * @param {Interfaces.IBaseUser} userP Usuário executando a operação.
   * @returns {Promise< IUser >}
   * @memberof UserDAO
   */
  public find ( id: string, userP: Interfaces.IBaseUser ): Promise< IUser > {
    let userData: IUser

    return super.find( userP.id, userP )
      .then( ( _userData: IUser ) => {
        userData = _userData
        return Promise.all( [
          super.find( id, userP ),
          this.buildingBasicDAO.find( this.getBuildingId( userData ), userData )
        ] )
      } )
      .then( ( [ user, building ] ) => {
        // Se o usuário logado não for AFAZER.
        if ( userData.tpUser !== ETypeUser.ADMIN ) {
          // Se o usuário que está sendo buscado for patrocinável.
          if ( _.indexOf( usersSponsored, user.tpUser ) >= 0 ) {
            // Se não for patrocinado e ele não for do mesmo empreendimento que o usuário logado está.
            if ( !user.sponsored && ( building ? user.buildingId !== building.id : true ) ) {
              throw new Services.APIError( `Não foi possível buscar os dados do ${ this.getTpUser( user.tpUser ) }.`, 403 )
            }
          } else
          // Se não for os dados do usuário logado e ele não possui acesso de admin no empreendimento.
          if ( userData.id !== user.id && !ServiceBuilding.userAdminToBuilding( userData, building ) ) {
            throw new Services.APIError( `Usuário não encontrado.`, 404 )
          }
        }
        // Else final(todos os casos).
        return user
      } )
  }

  /**
   * Busca todos os usuários.
   *
   * @param {Object} [query={}] Filtro da busca.
   * @param {Interfaces.IBaseUser} userP Usuário executando a operação.
   * @param {boolean} [isWithJob] Se estiver definido com `true` o filtro de usuários está sendo feito pelo job.
   * @returns {Promise< Array< IUser > >}
   * @memberof UserDAO
   */
  public findAll ( query: Object = {}, userP: Interfaces.IBaseUser, isWithJob?: boolean ): Promise< Array< IUser > > {
    let userData: IUser

    if ( isWithJob ) {
      return super.findAll( query, userP )
    }

    return super.find( userP.id, userP )
      .then( ( _userData: IUser ) => {
        userData = _userData
        return Promise.all( [
          super.findAll( query, userP ),
          this.buildingBasicDAO.find( this.getBuildingId( userData ), userData )
        ] )
      } )
      .then( ( [ users, building ] ) => {
        // Se o usuário logado não AFAZER.
        if ( userData.tpUser !== ETypeUser.ADMIN ) {
          // Remove os patrocináveis que não forem do mesmo empreendimento que o usuário logado.
          _.remove( users, ( user: IUser ) => {
            return _.indexOf( usersSponsored, user.tpUser ) >= 0 && !user.sponsored && ( building ? user.buildingId !== building.id : true )
          } )
          // Se o usuário logado não possuir acesso de admin no empreendimento.
          if ( !ServiceBuilding.userAdminToBuilding( userData, building ) ) {
            // Redefine o array de usuários somente os dados do usuário logado.
            users = [ _.find( users, { id: userData.id } ) ]
          }
        }
        // Else final(todos os casos).
        return users
      } )
  }

  /**
   * Método create para cadastrar os dados do usuário validando os dados específico para cada tipo
   *
   * @param {IUser} obj
   * @param {Interfaces.IBaseUser} baseUser
   * @param {boolean} [isWithJob] Se estiver definido com `true` a inserção do usuário está sendo feito pelo job.
   * @returns {Promise< IUser >}
   *
   * @memberOf UserDAO
   */
  public create ( obj: IUser, baseUser: Interfaces.IBaseUser, isWithJob?: boolean ): Promise< IUser > {
    let userData: IUser
    let user: IUser = new User( obj )

    if ( isWithJob ) {
      return super.create( obj, baseUser )
    }

    let validationError: boolean = false
    let dataValidate: Array< JSData.SchemaValidationError > = this.schema.validate( user )
    let filterDoc: any = {
      where: {
        numDocFed: { '===': obj.numDocFed }
      }
    }
    let filterEmail: any = {
      where: {
        email: { '|===': obj.email },
        alternativeEmail: { '|===': obj.email }
      }
    }
    let filterAlternativeEmail: any = {
      where: {
        email: { '|===': obj.alternativeEmail || '' },
        alternativeEmail: { '|===': obj.alternativeEmail || '' }
      }
    }
    const callError = ( msg: string, statusCode: number, objError: any = {} ) => {
      throw new Services.APIError( msg, statusCode, objError )
    }
    return super.find( baseUser.id, baseUser )
      .then( ( _userData: IUser ) => {
        userData = _userData
        return Promise.all( [
          super.findAll( filterDoc, baseUser ),
          super.findAll( filterEmail, baseUser ),
          super.findAll( filterAlternativeEmail, baseUser ),
          this.buildingBasicDAO.find( this.getBuildingId( userData ), userData )
        ] )
      } )
      .then( ( [ userDoc, userEmail, userAlternativeEmail, building ] ) => {
        if ( userData.tpUser !== ETypeUser.ADMIN && !ServiceBuilding.userAdminToBuilding( userData, building ) ) {
          return callError( 'Não foi possível inserir o usuário.', 403 )
        } else if ( dataValidate ) {
          throw new Services.APIError( 'Erro de entrada.', 400, dataValidate )
        } else if ( userDoc.length ) {
          return callError( 'O cpf/cnpj pertence a outro usuário', 400 )
        } else if ( userEmail.length ) {
          return callError( 'O email pertence a outro usuário', 400 )
        } else if ( user.alternativeEmail && userAlternativeEmail.length ) {
          return callError( 'O email alternativo pertence a outro usuário', 400 )
        } else if ( !serviceLib.cpfCnpjValidator( user.numDocFed ) ) {
          return callError( 'O cpf/cnpj não é válido', 400 )
        } else if ( !Services.ServiceLib.emailValidator( user.email ) ) {
          return callError( 'O email não é válido', 400 )
        } else if ( user.alternativeEmail && !Services.ServiceLib.emailValidator( user.alternativeEmail ) ) {
          return callError( 'O email alternativo não é válido', 400 )
        }
        if ( _.indexOf( usersCompany, user.tpUser ) >= 0 ) {
          validationError = !user.fantasyName
        } else if ( user.tpUser === ETypeUser.DESIGNER ) {
          validationError = !user.creaCau || !user.formation
        }
        if ( validationError ) {
          return callError( 'Erro de entrada', 400, this.schemaUser.validate( user ) )
        }
        if ( _.indexOf( usersSponsored, user.tpUser ) >= 0 ) {
          if ( userData.tpUser !== ETypeUser.ADMIN ) {
            obj.buildingId = user.activeBuildingId
            obj.sponsored = false
          } else {
            obj.buildingId = null
            obj.sponsored = true
          }
        }

        // TODO remover if a abaixo quando as telas de cadastro de senha e forgot estiverem funcionando.
        if ( _.indexOf( usersAccess, user.tpUser ) >= 0 ) {
          obj.password = Services.ServiceLib.hashPassword( 'asd123' )
        }

        return super.create( obj, baseUser )
      } )
      .then( ( user: IUser ) => this.sendNotificationMail( user, true ) )
  }

  /**
   * Atualiza os dados do usuário
   *
   * @param {string} id
   * @param {Interfaces.IBaseUser} user
   * @param {IUser} obj
   * @returns {Promise<IUser>}
   *
   * @memberOf UserDAO
   */
  public update ( id: string, userP: Interfaces.IBaseUser, obj: IUser ): Promise < IUser > {
    let userData: IUser
    let dataValidate: Array< JSData.SchemaValidationError >
    const filterEmail: any = {
      where: {
        email: { '|===': obj.email || '' },
        alternativeEmail: { '|===': obj.email || '' }
      }
    }
    const filterAlternativeEmail: any = {
      where: {
        email: { '|===': obj.alternativeEmail || '' },
        alternativeEmail: { '|===': obj.alternativeEmail || '' }
      }
    }
    const fieldsObj: Array< string > = Object.keys( obj )
    const fieldsNotUp: Array< string > = [ 'id', 'active', 'createdAt', 'numDocFed', 'email', 'alternativeEmail',
      'tpUser', 'buildingId', 'lastBuildingsId', 'password' ]
    const data: IUser = serviceLib.fieldsUpValidator( obj, fieldsObj, fieldsNotUp )
    const callError = ( msg: string, statusCode: number, objError: any = {} ) => {
      throw new Services.APIError( msg, statusCode, objError )
    }

    return this.find( userP.id, userP )
      .then( ( _userData: IUser ) => {
        userData = _userData
        return Promise.all( [
          this.find( id, userP ),
          super.findAll( filterEmail, userP ),
          super.findAll( filterAlternativeEmail, userP ),
          this.buildingBasicDAO.find( this.getBuildingId( userData ), userData )
        ] )
      } )
      .then( ( [ user, userEmail, userAlternativeEmail, building ] ) => {
        if ( userData.tpUser !== ETypeUser.ADMIN ) {
          // Edição está sendo feita pelo próprio usuário logado.
          if ( userData.id === user.id ) {
            delete data.buildingsId
          } else
          // Se a edição não está sendo feita por admin.
          // Ou se é admin em um empreendimento mas o usuário não pertence ao empreendimento.
          if (
            !ServiceBuilding.userAdminToBuilding( userData, building ) ||
            (
              ServiceBuilding.userAdminToBuilding( userData, building ) &&
              !ServiceBuilding.userBelongsToBuilding( user, building ) &&
              !_.difference( data.buildingsId, user.buildingsId ).length &&
              _.indexOf( data.buildingsId, building.id ) < 0
            )
          ) {
            return callError( 'Não foi possível atualizar o usuário.', 403 )
          }
        }
        // Salvando as ids dos empreendimentos que o usuário está associado.
        user.lastBuildingsId = user.buildingsId
        // Sobreescrevendo dados do usuário para validação.
        Object.assign( user, data )
        // Validando os dados do usuário após a sobreescrita.
        dataValidate = this.schema.validate( user )
        // Verificando se houve alguma inconsistência com os dados sobreescritos.
        if ( dataValidate ) {
          return callError( 'Erro de entrada.', 400, dataValidate )
        }
        // Verificando se o email será atualizado e se ele já pertence a outro usuário (exceto a ele mesmo)
        if ( obj.email ) {
          if ( _.differenceBy( userEmail, [ user ], 'id' ).length ) {
            return callError( 'O email já pertence a outro usuário', 400 )
          }
          data.email = obj.email
        }
        // Verificando se o email alternativo será atualizado e se ele já pertence a outro usuário (exceto a ele mesmo)
        if ( obj.alternativeEmail ) {
          if ( _.differenceBy( userAlternativeEmail, [ user ], 'id' ).length ) {
            return callError( 'O email alternativo já pertence a outro usuário', 400 )
          }
          data.alternativeEmail = obj.alternativeEmail
        }
        if ( _.indexOf( [ ETypeUser.SYNDIC, ETypeUser.SUBSIDY, ETypeUser.DEFAULT ], user.tpUser ) >= 0 ) {
          // if ( _.difference( data.buildingsId, user.lastBuildingsId ).length ) {
          //   data.lastBuildingsId = user.lastBuildingsId
          // } else {
          //   data.lastBuildingsId = user.lastBuildingsId
          // }
          data.lastBuildingsId = user.lastBuildingsId
        } else {
          delete data.lastBuildingsId
          delete data.buildingsId
        }
        if ( _.indexOf( [ ETypeUser.EQUIPMENTSUPPLIER, ETypeUser.MATERIALSUPPLIER, ETypeUser.SERVICEPROVIDER ], user.tpUser ) === -1 ) {
          delete data.tags
        }
        if ( userData.tpUser !== ETypeUser.ADMIN ) {
          delete data.sponsored
        }
        return super.update( id, userP, data )
      } )
      .then ( ( user: IUser ) => this.sendNotificationMail( user ) )
  }

  /**
   * Remove o usuário pela id.
   *
   * @param {string} id Id do usuário.
   * @param {Interfaces.IBaseUser} user Dados do usuário executando a operação.
   * @returns {Promise< boolean >}
   * @memberof EvidenceDAO
   */
  public delete ( id: string, user: Interfaces.IBaseUser ): Promise< boolean > {
    // TODO verificar se algum usuário poderá ser removido do sistema.
    // TODO e com esse usuário removido se isso impactará nos relacionamentos que ele estiver envolvido.
    throw new Services.APIError( 'Não foi possível remover o usuário.', 403 )
  }

  public paginatedQuery (
    search: any, userP: Interfaces.IBaseUser, page?: number, limit?: number, order?: Array<string>, options?: any
  ): Promise< Interfaces.IResultSearch< IUser > > {
    let _page: number = search.page || page || 1
    let _limit: number = search.limit || limit || 10
    let _order: string[] = search.orderBy || []

    let params = {
      ...search,
      ...{ orderBy: _order }
    }

    return this.findAll( params, userP )
      .then( ( users: Array< IUser > ) => {
        return {
          page: _page,
          total: users.length,
          result: _.slice( users, _limit * ( _page - 1 ), _limit * _page )
        }
      } )
  }

  /**
   * Envia uma notificação por email ao usuário informando-o a associação com o empreendimento.
   *
   * @private
   * @param {IUser} user
   * @param {boolean} [isCreate=false]
   * @returns {Promise < IUser >}
   * @memberof UserDAO
   */
  private sendNotificationMail ( user: IUser, isCreate: boolean = false ): Promise < IUser > {
    // Verificando se o usuário possui algum empreendimento associado
    // E se ele é do tipo default, síndico ou subsindico e já possui uma senha cadastrada
    let tpUsers: Array< ETypeUser > = [ ETypeUser.SYNDIC, ETypeUser.SUBSIDY, ETypeUser.DEFAULT ]
    let obj: any = {
      user
    }
    if ( _.indexOf( tpUsers, user.tpUser ) >= 0 && _.difference( user.buildingsId, user.lastBuildingsId ).length ) {
      let urlL: string = process.env.LOGIN_URL
      // Verifica se já possui senha registrada
      // TODO descomentar linhas a abaixo e voltar ao que era antes quando as telas de cadastro de senha e forgot estiverem funcionando.
      /* if ( !user.password || ( user.password && !user.password.length ) ) {
        let token: string = this.serviceLib.generateToken( user.email )
        urlL = url.resolve( this.appConfig.getSignUpUrl(), token )
        this.sendMail.sendGenericEmail( obj, 'Empreendimento associado', urlL, 'association-with-confirmation' ) */
      if ( isCreate ) {
        this.sendMail.sendGenericEmail( obj, 'Empreendimento associado', urlL, 'association-with-confirmation' )
      } else {
        this.sendMail.sendGenericEmail( obj, 'Empreendimento associado', urlL, 'association' )
      }
    }
    return Promise.resolve( user )
  }

  /**
   * Retorna o tipo do usuário.
   *
   * @private
   * @param {ETypeUser} tpUser Tipo do usuário.
   * @returns {string}
   * @memberof UserDAO
   */
  private getTpUser ( tpUser: ETypeUser ): string {
    if ( tpUser === ETypeUser.EQUIPMENTSUPPLIER ) {
      return 'Fornecedor de equipamentos'
    } else if ( tpUser === ETypeUser.SERVICEPROVIDER ) {
      return 'Prestador de serviços'
    } else if ( tpUser === ETypeUser.MATERIALSUPPLIER ) {
      return 'Fornecedor de materiais'
    }

    return null
  }

  /**
   * Pega a id do empreendimento dos dados do usuário.
   *
   * @private
   * @param {IUser} user Dados do usuário.
   * @returns {string}
   * @memberof UserDAO
   */
  private getBuildingId ( user: IUser ): string {
    if ( user.activeBuildingId ) {
      return user.activeBuildingId
    } else if ( user.buildingsId && user.buildingsId.length ) {
      return _.head( user.buildingsId )
    } else {
      return ''
    }
  }
}
