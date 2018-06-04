import { IDAOController } from '../interfaces'
import { BaseRouter } from './base-router'
import { Router } from 'express'
import * as JSData from 'js-data'

/**
 * Class base para os roteamentos.
 * 
 * @export
 * @class DAORouter
 * @extends {BaseRouter}
 * @template M Interface do model.
 * @template C Controller do model.
 */
export class DAORouter< M, C extends IDAOController< M > > extends BaseRouter {
  controller: C
  router: Router

  constructor ( store: JSData.DataStore, controller: C ) {
    super()
    this.controller = controller
    this.router = Router()
    this.routers()
  }

  public routers () {
    /* GET lista todos os registros da classe corrente em controller. */
    this.router.get( '/', ( req, res, next ) => this.respond( this.controller.findAll( req, res, next ), res ) )

    /* GET busca o registro com o id. */
    this.router.get( '/:id', ( req, res, next ) => this.respond( this.controller.find( req, res, next ), res ) )

    /* POST cria um novo registro da classe corrente em controller. */
    this.router.post( '/', ( req, res, next ) => this.respond( this.controller.create( req, res, next ), res ) )

    /* PUT atualiza o registro. */
    this.router.put( '/:id', ( req, res, next ) => this.respond( this.controller.update( req, res, next ), res ) )

    /* DELETE deleta o registro com o id. */
    this.router.delete( '/:id', ( req, res, next ) => this.respond( this.controller.delete( req, res, next ), res ) )

    /* POST lista paginada com os registros da classe corrente em controller. */
    this.router.post( '/query', ( req, res, next ) => this.respond( this.controller.query( req, res, next ), res ) )
  }

  public getRouter (): Router {
    return this.router
  }
}