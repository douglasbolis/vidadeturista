import { IDAO, INextFunction, IRequest, IResponse, IResultSearch } from '.'

/**
 * Interface de persistência dos controllers.
 * 
 * @export
 * @interface IDAOController
 * @template T 
 */
export interface IDAOController< T > {
  collection: IDAO< T >
  find ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< T >
  findAll ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< Array< T > >
  create ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< T >
  update ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< T >
  delete ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< boolean >
  query ( req: IRequest, res: IResponse, next?: INextFunction ): Promise< IResultSearch< T > >
}
