"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const path = require("path");
const clean = require('gulp-clean');
const gulp = require('gulp');
const serverPath = 'server';
const extFilesToClean = ['**/*.js', '**/*.js.map', '**/*.d.ts'];
const filesToClean = extFilesToClean.map(el => `${serverPath}/${el}`);
const tsProject = ts.createProject('tsconfig.json');
const serverTS = `${serverPath}/**/*.ts`;
const tsCompile = () => gulp
    .src(serverTS)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(tsProject())
    .pipe(sourcemaps.write('.', { includeContent: false, sourceRoot: path.join(__dirname, serverPath) }))
    .pipe(gulp.dest(serverPath));
// Tasks
gulp.task('default', ['ts'], () => gulp.watch(serverTS, ['ts-inc']));
gulp.task('ts-inc', () => tsCompile());
gulp.task('tslint', () => gulp.src(serverTS)
    .pipe(tslint.default({ configuration: 'tslint.json' }))
    .pipe(tslint.default.report()));
gulp.task('ts', ['clean'], () => tsCompile());
gulp.task('clean', () => gulp
    .src(filesToClean, { read: false })
    .pipe(clean()));
//# sourceMappingURL=gulpfile.js.map