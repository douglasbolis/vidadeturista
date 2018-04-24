import { IBaseModel, IDAO, IResultSearch } from '.'
import { Request, Response } from 'express'

/**
 * Interface de persistência dos controllers.
 * 
 * @export
 * @interface IPersistController
 * @template T 
 */
export interface IPersistController< T extends IBaseModel > {
  collection: IDAO< T >
  find ( req: Request, res: Response, next?: Function ): Promise< T >
  findAll ( req: Request, res: Response, next?: Function ): Promise< Array< T > >
  create ( req: Request, res: Response, next?: Function ): Promise< T >
  update ( req: Request, res: Response, next?: Function ): Promise< T >
  delete ( req: Request, res: Response, next?: Function ): Promise< boolean >
  query ( req: Request, res: Response, next?: Function ): Promise< IResultSearch< T > >
}
