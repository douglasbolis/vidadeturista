import { Interfaces } from 'js-data-dao'
import { IAgenda } from '../interfaces'

/**
 * Interface para usuário com as descrições de seus atributos.
 *
 * @export
 * @interface IUser
 * @extends {Interfaces.IBaseModel}
 * @extends {IAddress}
 */
export interface IUser extends Interfaces.IBaseModel, Interfaces.IBaseUser, IAddress {
  /**
   * Tipo de usuário.
   *
   * @type {ETypeUser}
   * @memberOf IUser
   */
  tpUser: ETypeUser

  /**
   * Se true o usuário pode acessar o sistema.
   *
   * @type {boolean}
   * @memberOf IUser
   */
  canAccess: boolean

  /**
   * Se false o usuário não completou o cadastro e servirá como um tipo controle.
   * E quando o usuário for cadastrado, se ele for do tipo que acessa o sistema, ele terá que completar o cadastro
   * através do link enviado no email para acessar a plataforma.
   *
   * @type {boolean}
   * @memberOf IUser
   */
  completed: boolean

  /**
   * Nome da usuário.
   *
   * @type {string}
   * @memberOf IUser
   */
  name: string

  /**
   * Número do documento cpf ou cnpj.
   *
   * @type {string}
   * @memberOf IUser
   */
  numDocFed: string

  /**
   * Telefone fixo.
   *
   * @type {string}
   * @memberOf IUser
   */
  phone: string

  /**
   * Telefone celular.
   *
   * @type {string}
   * @memberOf IUser
   */
  cellPhone: string

  /**
   * alternativeEmail.
   *
   * @type {string}
   * @memberOf IUser
   */
  email: string

  /**
   * Email alternativo.
   *
   * @type {string}
   * @memberOf IUser
   */
  alternativeEmail: string

  /**
   * Foto do usuário.
   *
   * @type {string}
   * @memberOf IUser
   */
  photo: string

  /**
   * Lista dos agendamentos que o usuário criou.
   *
   * @type {Array<IAgenda>}
   * @memberOf IUser
   */
  createdAgendas: Array< IAgenda >

  /**
   * webSite.
   *
   * @type {string}
   * @memberOf IUser
   */
  webSite: string

  // Adm condomínio, Fornecedor de materiais, Prestadores de serviços, Fornecedor de equipamentos e Construtora.
  /**
   * Nome fantasia.
   * Geralmente associado a empresas.
   *
   * @type {string}
   * @memberOf IUser
   */
  fantasyName: string

  /**
   * Contado da empresa.
   *
   * @type {string}
   * @memberOf IUser
   */
  contact: string

  // Fornecedor de materiais, Prestadores de serviços e Fornecedor de equipamentos.
  /**
   * Array com as ids das tags para identificação como palavras chaves.
   * Somente Fornecedor de materiais, Prestadores de serviços e Fornecedor de equipamentos vão precisar.
   *
   * @type {Array< string >}
   * @memberof IUser
   */
  tags: Array< string >

  /**
   * Indicador se os Fornecedor de materiais, Prestadores de serviços e Fornecedor de equipamentos são patrocinados.
   *
   * @type {boolean}
   * @memberof IUser
   */
  sponsored: boolean

  /**
   * Id do empreendimento na qual o patrocinado pertence.
   *
   * @type {string}
   * @memberof IUser
   */
  buildingId: string | null

  // Adm condomínio.
  /**
   * Data do início das atividades.
   *
   * @type {string}
   * @memberOf IUser
   */
  startActivities: string

  // Projetista, Fornecedor de materiais, Prestadores de serviços, Fornecedor de equipamentos e Construtora.
  /**
   * CREA/CAU da empresa ou projetista.
   *
   * @type {string}
   * @memberOf IUser
   */
  creaCau: string

  /**
   * Se está em atividades.
   *
   * @type {boolean}
   * @memberOf IUser
   */
  inActivity: boolean

  // Projetista.
  /**
   * Formação do projetista.
   *
   * @type {string}
   * @memberOf IUser
   */
  formation: string

  /**
   * Empresa do projetista.
   *
   * @type {string}
   * @memberof IUser
   */
  company: string

  /**
   * Cnpj da empresa do projetista.
   *
   * @type {string}
   * @memberof IUser
   */
  cnpj: string

  // Síndico e Morador.
  /**
   * Profissão do morador/síndico/sub-síndico.
   *
   * @type {string}
   * @memberOf IUser
   */
  profession: string

  /**
   * Data de nascimento do morador/síndico/sub-síndico.
   *
   * @type {string}
   * @memberOf IUser
   */
  dateBirth: string

  /**
   * Ids dos empreendimentos que o usuário mora/pertence.
   * Esse array servirá para armazenar as ids dos empreendimentos e facilitará na vinculação do usuário ao empreendimento
   * quando for atribuir uma função a ele.
   * Ex.: Síndico/Sub-síndico.
   *
   * @type {Array< string >}
   * @memberof IUser
   */
  buildingsId: Array< string >

  /**
   * Ids dos empreendimentos antes da atualização do usuário.
   * Esse array servirá para armazenar as ids dos empreendimentos da última atualização.
   *
   * @type {Array< string >}
   * @memberof IUser
   */
  lastBuildingsId: Array< string >

  /**
   * Id do empreendimento que o usuário está atualmente logado.
   * Esse campo será referência para os filtros para os registros do empreendimento.
   *
   * @type {string}
   * @memberof IUser
   */
  activeBuildingId: string | null
}

/**
 * Interface para os endereços das entidades.
 *
 * @export
 * @interface IAddress
 */
export interface IAddress {

  /**
   * Latitude do endereço.
   *
   * @type {number}
   * @memberof IAddress
   */
  latitude?: number

  /**
   * Longitude do endereço.
   *
   * @type {number}
   * @memberof IAddress
   */
  longitude?: number

  /**
   * Cep.
   *
   * @type {string}
   * @memberOf IAddress
   */
  zipCode: string

  /**
   * Endereço rua ou avenida.
   *
   * @type {string}
   * @memberOf IAddress
   */
  address: string

  /**
   * Número.
   *
   * @type {string}
   * @memberOf IAddress
   */
  number: string

  /**
   * Complemento para o endereço.
   *
   * @type {string}
   * @memberOf IAddress
   */
  complement: string

  /**
   * Bairro.
   *
   * @type {string}
   * @memberOf IAddress
   */
  neighbor: string

  /**
   * Cidade.
   *
   * @type {string}
   * @memberOf IAddress
   */
  city: string

  /**
   * Estado.
   *
   * @type {string}
   * @memberOf IAddress
   */
  state: string

  /**
   * País.
   *
   * @type {string}
   * @memberOf IAddress
   */
  country: string
}

/**
 * Enum para o tipo de usuário.
 *
 * @export
 * @enum {number}
 */
export enum ETypeUser {

  /**
   * Admin.
   */
  ADMIN, // 0

  /**
   * Construtora.
   */
  CONSTRUCTIONCOMPANY, // 1

  /**
   * Adminstradora de condomínio e Síndico profissional.
   */
  CONDOMINIUMMANAGER, // 2

  /**
   * Síndico.
   */
  SYNDIC, // 3

  /**
   * Sub-síndico.
   */
  SUBSIDY, // 4

  /**
   * Morador.
   */
  DEFAULT, // 5

  /**
   * Projetista.
   */
  DESIGNER, // 6

  /**
   * Fornecedor de Equipamentos.
   */
  EQUIPMENTSUPPLIER, // 7

  /**
   * Fornecedor de Material.
   */
  MATERIALSUPPLIER, // 8

  /**
   * Prestador de serviços.
   */
  SERVICEPROVIDER // 9
}

// TOdo verificar como será implementado essa parte

/**
 * Enum para os níveis de acessos dos usuários no sistema.
 *
 * @export
 * @enum {number}
 */
export enum EStatus {

  /**
   * Admin.
   */
  ADMIN,

  /**
   * Atividades.
   */
  ACTIVITIES,

  /**
   * Visualização.
   */
  VISUALIZATION
}
