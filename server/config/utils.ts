/**
 * Busca o valor da variável de ambiente.
 * 
 * @param {string} key Variável de ambiente.
 * @returns Valor da variável de ambiente.
 */
export const getEnv = ( key: string ) => {
  if ( !process.env[ key ] ) {
    console.warn( `a variavel ${ key } não foi definida` )
    return null
  } else {
    return process.env[ key ]
  }
}
