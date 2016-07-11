'use strict';

var gulp = require('gulp');
var del = require('del');
var merge = require('merge2');
var sequence = require('run-sequence');
var $ = require('gulp-load-plugins')({lazy: true});

gulp.task('default', ['build']);

gulp.task('build', function(done) {
    sequence('clean', 'generate-defs', 'compile', done);
});

gulp.task('compile', function() {
    var tsProject = $.typescript.createProject('tsconfig.json');
    var tsResult = tsProject.src()
        .pipe($.typescript(tsProject));
    return merge([
        tsResult.js
            .pipe(gulp.dest('./dist/')),
        tsResult.dts
            .pipe($.stripLine(`/// <reference path="`))
            .pipe(gulp.dest("./dist/"))
    ]);
});

gulp.task('generate-defs', function(done) {
    log('Generating package definition file.');
    sequence('def_delete', 'def_copy_template', 'def_generate', done);
});

gulp.task('def_delete', function(done) {
    log('Deleting any existing package definition file.', true);
    clean('./typings/package.d.ts', done);
});

gulp.task('def_copy_template', function() {
    log('Copying the package definition template file.', true);
    gulp.src('./typings/package.d.ts.template')
        .pipe($.rename('package.d.ts'))
        .pipe(gulp.dest('./typings/'))
});

gulp.task('def_generate', function() {
    var injectSrc = gulp.src([
        './src/module.ts',
        './src/**/*.ts'
    ], {read: false});
    var injectOptions = {
        starttag: '//{',
        endtag: '//}',
        transform: filePath => `/// <reference path="..${filePath}" />`
    };
    return gulp.src('./typings/package.d.ts')
        .pipe($.inject(injectSrc, injectOptions))
        .pipe(gulp.dest('./typings/'));
});

gulp.task('clean', function(done) {
    clean('./dist/', done);
});

gulp.task('setup', function() {
    log('Setting up Git hooks');
    return gulp.src('./.pre-commit')
        .pipe($.symlink('./.git/hooks/pre-commit', {force: true}));
});

function clean(path, done) {
    log(`Deleting: ${path}`);
    del(path);
    done(); //TODO: Bug with current version of del that prevents passing done as the second parameter.
}

function log(message, subMessage) {
    var color = subMessage ? $.util.colors.bgYellow : $.util.colors.bgBlue;
    if (subMessage) {
        message = '    ' + message;
    }
    $.util.log(color(message));
}
