'use strict';

const gulp            = require('gulp');
const run             = require('run-sequence');
const sourcemaps      = require('gulp-sourcemaps');
const babel           = require('gulp-babel');
const sass            = require('gulp-sass');
const imagemin        = require('gulp-imagemin');
const concat          = require('gulp-concat');
const uglify          = require('gulp-uglify');
const autoprefixer    = require('gulp-autoprefixer');
const browserSync     = require('browser-sync').create();
const del             = require('del');

const paths = {
    styles: 'app/assets/scss/**/*.scss',
    views: ['app/**/*.html', 'app/*.json'],
    scripts: ['app/**/*.js', '!app/assets/scripts/**/*.js'],
    vendorScripts: 'app/assets/scripts/**/*.js',
    images: 'app/assets/images/**/*'
};

// Tasks
const clean = (callback) => {
    return del(['dist', 'docs'], callback);
};

const serve = () => {
    return run('styles', 'scripts', 'vendorScripts', 'images', 'views', 'serve', 'docs');
};

const initBrowserSync = () => {
    browserSync.init({
        server: 'dist'
    });
};

const views = () => {
    return gulp.src(paths.views, {
        base: 'app'
    }).pipe(gulp.dest('dist'));
};

const vendorScripts = () => {
    return gulp.src(paths.vendorScripts, {
        base: 'app/assets/scripts'
    }).pipe(gulp.dest('dist/assets/scripts'));
};

const styles = () => {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
};

const scripts = () => {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'));
};

const images = () => {
    return gulp.src(paths.images)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/assets/images'));
};

const watch = () => {
    gulp.watch(paths.scripts,   ['scripts', browserSync.reload]);
    gulp.watch(paths.images,    ['images',  browserSync.reload]);
    gulp.watch(paths.styles,    ['styles',  browserSync.reload]);
    gulp.watch(paths.views,     ['views',   browserSync.reload]);
};

const docs = () => {
    return gulp.src('dist/**/*', {
        base: 'dist'
    })
        .pipe(gulp.dest('docs'));
};


gulp.task('clean',                      clean);
gulp.task('serve',          ['watch'],  initBrowserSync);
gulp.task('views',                      views);
gulp.task('vendorScripts',              vendorScripts);
gulp.task('styles',                     styles);
gulp.task('scripts',                    scripts);
gulp.task('images',                     images);
gulp.task('watch',                      watch);
gulp.task('docs',                       docs);

gulp.task('default',        ['clean'],  serve());