'use strict';

var gulp            = require('gulp');
var run             = require('run-sequence');
var sourcemaps      = require('gulp-sourcemaps');
var babel           = require('gulp-babel');
var sass            = require('gulp-sass');
var imagemin        = require('gulp-imagemin');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var autoprefixer    = require('gulp-autoprefixer');
var browserSync     = require('browser-sync').create();
var del             = require('del');

var paths = {
    styles: 'app/assets/scss/**/*.scss',
    views: ['app/**/*.html', 'app/*.json'],
    scripts: ['app/**/*.js', '!app/assets/scripts/**/*.js'],
    vendorScripts: 'app/assets/scripts/**/*.js',
    images: 'app/assets/images/**/*'
};


gulp.task('clean', function (cb) {
    return del(['dist', 'docs'], cb);
});

gulp.task('serve', ['watch'], function() {
    browserSync.init({
        server: 'dist'
    });
});

gulp.task('views', function () {
    return gulp.src(paths.views, {
        base: 'app'
    }).pipe(gulp.dest('dist'));
});

gulp.task('vendorScripts', function () {
    return gulp.src(paths.vendorScripts, {
        base: 'app/assets/scripts'
    }).pipe(gulp.dest('dist/assets/scripts'));
});

gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/'));
});

gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('dist/assets/images'));
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts,   ['scripts', browserSync.reload]);
    gulp.watch(paths.images,    ['images',  browserSync.reload]);
    gulp.watch(paths.styles,    ['styles']);
    gulp.watch(paths.views,     ['views',   browserSync.reload]);
});

gulp.task('docs', function() {
   return gulp.src('dist/**/*', {
       base: 'dist'
   })
       .pipe(gulp.dest('docs'));
});

function serve() {
    return run('styles', 'scripts', 'vendorScripts', 'images', 'views', 'serve', 'docs');
}

gulp.task('default', ['clean'], serve());