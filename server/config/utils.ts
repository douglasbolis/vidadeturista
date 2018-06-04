/**
 * Busca o valor da variável de ambiente.
 * 
 * @param {string} key Variável de ambiente.
 * @returns Valor da variável de ambiente.
 */
export const getEnv = ( key: string ) => {
  const envValue: string = process.env[ key ] || null
  if ( !envValue ) {
    console.warn( `A variável de ambiente [${ key }] não foi definida.` )
  }
  return envValue
}
