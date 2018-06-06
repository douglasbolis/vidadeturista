import { IExcursion } from '../interfaces'
import { ServiceLib } from '../services'
import { AppConfig } from '../config'
import { Excursion } from '../models'
import { DAO } from '.'
import * as JSData from 'js-data'

/**
 * Classe de excursão de persistência dos dados utilizando a classe DAO.
 *
 * @export
 * @class ExcursionDAO
 * @extends {DAO<IExcursion>}
 */
export class ExcursionDAO extends DAO< IExcursion > {
  serviceLib: ServiceLib
  constructor ( store: JSData.DataStore, appConfig: AppConfig ) {
    const collectionName: string = 'excursions'
    const schemaAddress: Object = {
      type: 'object',
      properties: {
        zipCode: { type: 'string' },
        address: { type: 'string' },
        number: { type: 'string' },
        complement: { type: 'string' },
        neighbor: { type: 'string' },
        city: { type: 'string' },
        state: { type: 'string' },
        country: { type: 'string' }
      },
      required: [ 'zipCode', 'address', 'neighbor', 'city', 'state', 'country' ]
    }
    const schema = {
      type: 'object',
      properties: {
        origin: schemaAddress,
        destiny: schemaAddress,
        date: { type: 'string' },
        vehicleId: { type: 'string' },
        value: { type: 'number' }
      },
      required: [ 'origin', 'destiny', 'date', 'vehicleId', 'value' ]
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
   * @returns {IExcursion}
   *
   * @memberOf ExcursionDAO
   */
  public parseModel ( val: IExcursion ): IExcursion {
    return new Excursion( val )
  }
}
