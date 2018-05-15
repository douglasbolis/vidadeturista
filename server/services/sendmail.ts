import { ETypeMail } from '../interfaces'
import { ServiceLib } from '../services'
import { MailConfig } from '../config'
import * as smtpTransport from 'nodemailer-smtp-transport'
import * as nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'
import * as fs from 'fs-extra-promise'
import * as path from 'path'

/**
 * Class send mail user.
 * 
 * @export
 * @class SendMail
 */
export class SendMail {
  private transporter: nodemailer.Transporter
  private mailConfig: MailConfig
  constructor ( mailConfig: MailConfig ) {
    this.mailConfig = mailConfig
    const options: smtpTransport.SmtpOptions = {
      host: this.mailConfig.getHost(),
      port: this.mailConfig.getPort(),
      auth: {
        user: this.mailConfig.getUser(),
        pass: this.mailConfig.getPassword()
      }
    }
    this.transporter = nodemailer.createTransport( smtpTransport( options ) )
  }

  public sendForgotEmail ( name: string, email: string, url: string ): Promise< any > {
    return this.generateHtml( name, email, url, ETypeMail.forgot )
      .then( ( html: string ) => {
        return this.sendMail( email, 'Recuperação de senha', html )
      } )
      .catch( ( e: Error ) => {
        return ServiceLib.callMessageError( e.message, 400 )
      } )
  }

  public sendConfirmationEmail ( email: string, url: string ): Promise< any > {
    return this.generateHtml( '', email, url, ETypeMail.confirmation )
    .then( ( html: string ) => {
      return this.sendMail( email, 'Confirmação de Cadastro', html )
    } )
    .catch( ( e: Error ) => {
      return ServiceLib.callMessageError( e.message, 400 )
    } )
  }

  private sendMail ( to: string, subject: string, html: string ) {
    const options: nodemailer.SendMailOptions = {
      // from === nome da empresa
      from: `${ this.mailConfig.getFrom() } <${ this.mailConfig.getEmail() }>`,
      // para quem o email será enviado
      to,
      // assunto do email
      subject,
      // corpo do email
      html
    }
    return this.transporter.sendMail( options )
  }

  private generateHtml ( name: string, email: string, url: string, type: ETypeMail ): Promise< string > {
    const chooseTemplate = ( _type: ETypeMail ) => {
      if ( _type === ETypeMail.confirmation ) {
        return path.join( this.mailConfig.getLayoutPath(), `confirmation.hbs` )
      } else {
        return path.join( this.mailConfig.getLayoutPath(), `forgot.hbs` )
      }
    }

    return Promise.resolve(
      fs.readFileAsync( ( chooseTemplate( type ) ), 'utf-8' )
        .then( ( html: string ) => handlebars.compile( html )( { name, email, url } ) )
    )
  }

}
