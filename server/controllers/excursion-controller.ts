import { IExcursion } from '../interfaces'
import { AppConfig } from '../config'
import { ExcursionDAO } from '../dao'
import { DAOController } from '.'
import * as JSData from 'js-data'

/**
 * Class ExcursionController.
 * 
 * @export
 * @class ExcursionController
 * @extends {DAOController<IExcursion>}
 */
export class ExcursionController extends DAOController< IExcursion > {
  public constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    super( new ExcursionDAO( store, appConfig ) )
  }
}
