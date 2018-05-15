import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'
import * as tslint from 'gulp-tslint'
import * as mocha from 'gulp-mocha'
import * as gulp from 'gulp'
import * as path from 'path'

const remapIstanbul = require( 'remap-istanbul/lib/gulpRemapIstanbul' )
const istanbul = require( 'gulp-istanbul' )
const clean = require( 'gulp-clean' )

const serverPath = 'server'
const files2Clean = [ '**/*.js', '**/*.js.map', '**/*.d.ts' ].map( el => `${ serverPath }/${ el }` )

const testPath = `${ serverPath }/**/*.spec.js`
const tsProject = ts.createProject( 'tsconfig.json' )
const serverTS = `${ serverPath }/**/*.ts`
const compiledPath = `${ serverPath }/**/**.js`

const runTest = () => gulp.src( [ testPath ] ) // take our transpiled test source
  .pipe( mocha( { timeout: 64000 } ) ) // runs tests

const runCoverage = () => gulp.src( './coverage/coverage-final.json' )
  .pipe( remapIstanbul( {
    basePath: serverPath,
    reports: {
      'html': './coverage',
      'text-summary': null,
      'lcovonly': './coverage/lcov.info'
    }
  } ) )

const tsCompile = () => gulp
  .src( serverTS )
  .pipe( sourcemaps.init( { loadMaps: true } ) )
  .pipe( tsProject() )
  .pipe( sourcemaps.write( '.', { includeContent: false, sourceRoot: path.join( __dirname, serverPath ) } ) )
  .pipe( gulp.dest( serverPath ) )

// Tasks
gulp.task( 'default', [ 'ts' ] , () => gulp.watch( serverTS, [ 'ts-inc' ] ) )

gulp.task( 'ts-inc', () => tsCompile() )

gulp.task( 'tslint', () => gulp.src( serverTS )
  .pipe( tslint.default( { configuration: 'tslint.json' } ) )
  .pipe( tslint.default.report() )
)

gulp.task( 'ts', [ 'clean' ], () => tsCompile() )

gulp.task( 'clean', () => gulp
  .src( files2Clean, { read: false } )
  .pipe( clean() )
)

gulp.task( 'pre-test', [ 'ts', 'tslint' ], () => {
  return gulp.src( [ compiledPath, `!${ testPath }` ] )
    .pipe( istanbul() )
    .pipe( istanbul.hookRequire() ) // Force `require` to return covered files
} )

gulp.task( 'test', [ 'pre-test' ], () => runTest()
  .once( 'error', ( error: Error ) => {
    console.error( error.message )
    process.exit( -1 )
  } )
  .once( 'end', () => process.exit() )
)

gulp.task( 'test-coverage', [ 'pre-test' ], () => runTest()
  .once( 'error', ( error: Error ) => {
    console.error( error.message )
    process.exit( -1 )
  } )
  .pipe( istanbul.writeReports( {
    reporters: [ 'json' ]
  } ) )
)

gulp.task( 'coverage', [ 'test-coverage' ], () => runCoverage()
  .once( 'end', () => process.exit() )
)
