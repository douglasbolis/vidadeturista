import { DatabaseConfig } from './database-config'
import { MailConfig } from './mail-config'
import { getEnv } from './utils'

/**
 * Classe para toda a configuração da aplicação.
 * 
 * @export
 * @class AppConfig
 */
export class AppConfig {
  public mailConfig: MailConfig
  public dbConfig: DatabaseConfig
  private mainCompany: string
  private isProd: boolean
  private cryptoAlgorithm: string
  private cryptoPassword: string
  private expirationDays: number
  private jwtConfig: any
  private usersTable: string
  private signUpUrl: string
  private forgotUrl: string

  constructor () {
    this.mainCompany = getEnv( 'MAIN_COMPANY' )
    this.isProd = ( process.env.NODE_ENV === 'production' )
    this.cryptoAlgorithm = getEnv( 'CRYPTO_ALGORITHM' ) || 'aes192'
    this.cryptoPassword = getEnv( 'CRYPTO_PASSWORD' )
    this.expirationDays = Number.parseInt( getEnv( 'EXPIRATION_DAYS' ), 10 ) || 3
    this.usersTable = getEnv( 'USERS_TABLE' ) || 'users'
    this.signUpUrl = getEnv( 'SIGNUP_URL' ) || 'http://foo.bar/auth/signup'
    this.forgotUrl = getEnv( 'FORGOT_URL' ) || 'http://foo.bar/auth/forgot'
    this.jwtConfig = {
      strategy: 'jwt',
      secret: getEnv( 'APP_JWT_SECRET' ),
      session: { session: ( getEnv( 'APP_JWT_SESSION' ) || false as boolean ) }
    }
    this.mailConfig = new MailConfig()
    this.dbConfig = new DatabaseConfig()

  }

  public getMainCompany (): string {
    return this.mainCompany
  }

  public getIsProd (): boolean {
    return this.isProd
  }

  public getCryptoAlgorithm (): string {
    return this.cryptoAlgorithm
  }

  public getCryptoPassword (): string {
    return this.cryptoPassword
  }

  public getExpirationDays (): number {
    return this.expirationDays
  }

  public getUsersTable (): string {
    return this.usersTable
  }

  public getJwtConfig (): any {
    return this.jwtConfig
  }

  public getSignUpUrl (): string {
    return this.signUpUrl
  }

  public getForgotUrl (): string {
    return this.forgotUrl
  }
}
