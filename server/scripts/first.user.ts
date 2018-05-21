/**
 * Variáveis de ambiente
 */
import * as dotenv from 'dotenv'
dotenv.config()

import { ETypePerson, ETypeUser, IUser } from "../interfaces"
import { ServiceLib } from "../services"
import { AppConfig } from "../config"
import { UserDAO } from "../dao"
import { User } from "../models"
import * as JSData from 'js-data'

const store: JSData.DataStore = new JSData.DataStore()
const appConfig = new AppConfig()
store.registerAdapter(
  appConfig.dbConfig.getDatabase(),
  appConfig.dbConfig.getAdapter(),
  appConfig.dbConfig.getAdapterOptions()
)

class Firstuser {
  private userDAO: UserDAO
  private user: IUser
  constructor () {
    this.userDAO = new UserDAO( store, appConfig )
    this.user = new User( this.getUserData() )
  }

  public generateUser (): any {
    return store.create( this.userDAO.collectionName, this.user )
      .then( () => {
        console.log( `Usuário ${ this.user.firstname } inserido.` )
        process.exit( 0 )
      } )
      .catch( ( err: any ) => {
        console.error( err )
        process.exit( 1 )
      } )
  }

  private getUserData (): any {
    return {
      firstname: 'douglas',
      lastname: 'lima',
      email: 'douglasbolislima@gmail.com',
      numDocFed: '01234567890',
      type: ETypeUser.ADMIN,
      typePerson: ETypePerson.INDIVIDUAL,
      phones: [{phone: '2755554444', type: 0}],
      photo: '',
      dateBirth: '1994-03-30T03:00:00.000Z',
      companyAlias: 'vidadeturista',
      username: 'douglaslima',
      password: ServiceLib.hashPassword( 'asd123' ),
      city: 'Serra',
      state: 'ES',
      country: 'Brasil'
    }
  }
}

export const firstUser: Firstuser = ( new Firstuser() ).generateUser()
