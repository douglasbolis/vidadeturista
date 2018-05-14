import { NextFunction, Request, Response } from 'express'

/**
 * Interface IRequest.
 */
export interface IRequest extends Request {
  authInfo?: any
  user?: any

  // These declarations are merged into express's Request type.
  login ( user: any, done: ( err: any ) => void ): void
  login ( user: any, options: any, done: ( err: any ) => void ): void
  logIn ( user: any, done: ( err: any ) => void ): void
  logIn ( user: any, options: any, done: ( err: any ) => void ): void

  logout (): void
  logOut (): void

  isAuthenticated (): boolean
  isUnauthenticated (): boolean
}

/**
 * Interface para as respostas de requisição.
 * 
 * @export
 * @interface IResponse
 * @extends {Response}
 */
export interface IResponse extends Response {}

/**
 * Interface para as chamadas de função seguinte.
 * 
 * @export
 * @interface INextFunction
 * @extends {NextFunction}
 */
export interface INextFunction extends NextFunction {}
