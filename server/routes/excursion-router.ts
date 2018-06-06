import { ExcursionController } from '../controllers'
import { IExcursion } from '../interfaces'
import { DAORouter } from './dao-router'
import { AppConfig } from '../config'
import * as JSData from 'js-data'

/**
 * Classe de roteamento para as excursões.
 * 
 * @export
 * @class ExcursionRouter
 * @extends {DAORouter<IExcursion, ExcursionController>}
 */
export class ExcursionRouter extends DAORouter< IExcursion, ExcursionController > {
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super( store, new ExcursionController( store, appConfig ) )
  }
}
