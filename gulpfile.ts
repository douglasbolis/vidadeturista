import * as sourcemaps from 'gulp-sourcemaps'
import * as ts from 'gulp-typescript'
import * as tslint from 'gulp-tslint'
import * as path from 'path'

const clean = require( 'gulp-clean' )
const gulp = require( 'gulp' )

const serverPath: string = 'server'
const extFilesToClean: Array< string > = [ '**/*.js', '**/*.js.map', '**/*.d.ts' ]
const filesToClean: Array< string > = extFilesToClean.map( el => `${ serverPath }/${ el }` )

const tsProject = ts.createProject( 'tsconfig.json' )
const serverTS = `${ serverPath }/**/*.ts`

const tsCompile = () =>
  gulp
    .src( serverTS )
    .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( tsProject() )
    .pipe( sourcemaps.write( '.', { includeContent: false, sourceRoot: path.join( __dirname, serverPath ) } ) )
    .pipe( gulp.dest( serverPath ) )

// Tasks
gulp.task( 'default', [ 'ts' ] , () => gulp.watch( serverTS, [ 'ts-inc' ] ) )

gulp.task( 'ts-inc', () => tsCompile() )

gulp.task( 'tslint', () =>
  gulp.src( serverTS )
    .pipe( tslint.default( { configuration: 'tslint.json' } ) )
    .pipe( tslint.default.report() )
)

gulp.task( 'ts', [ 'clean' ], () => tsCompile() )

gulp.task( 'clean', () =>
  gulp
    .src( filesToClean, { read: false } )
    .pipe( clean() )
)
