'use strict';

const gulp         = require('gulp');
const run          = require('run-sequence');
const sourcemaps   = require('gulp-sourcemaps');
const babel        = require('gulp-babel');
const sass         = require('gulp-sass');
const imagemin     = require('gulp-imagemin');
const concat       = require('gulp-concat');
const uglify       = require('gulp-uglify');
const autoprefixer = require('gulp-autoprefixer');
const browserSync  = require('browser-sync').create();
const del          = require('del');

const appDir  = 'app';
const distDir = 'dist';
const docsDir = 'docs';

const paths = {
    src: {
        styles:        `${appDir}/assets/scss/**/*.scss`,
        scripts:       [`${appDir}/**/*.js`, `!${appDir}/assets/scripts/**/*.js`],
        vendorScripts: 'app/assets/scripts/**/*.js',
        images:        'app/assets/images/**/*',
        views:         [`${appDir}/**/*.html`],
        data:          [`${appDir}/data/**/*`]
    },
    
    dist: {
        styles:  `${distDir}/assets/css`,
        scripts: `${distDir}/assets/scripts`,
        images:  `${distDir}/assets/images`
    }
};

/**
 * Delete "dist" and "docs" folders.
 * @param callback
 */
const clean = (callback) => {
    return del([distDir, docsDir], callback);
};

/**
 * Run all tasks.
 * @returns {*}
 */
const serve = () => {
    return run('styles', 'scripts', 'vendorScripts', 'images', 'views', 'copyDataDir', 'docs', 'serve');
};

/**
 * Initialize "BrowserSync", set it to "look" at the "dist" folder.
 */
const initBrowserSync = () => {
    browserSync.init({
        server: distDir
    });
};

/**
 * Copy views (html files).
 */
const views = () => {
    return gulp.src(paths.src.views, {
        base: appDir
    }).pipe(gulp.dest(distDir));
};

/**
 * Copy the "data" folder.
 */
const copyDataDir = () => {
    return gulp.src(paths.src.data, {
        base: appDir
    })
    .pipe(gulp.dest(distDir));
};

/**
 * Copy vendor scripts.
 */
const vendorScripts = () => {
    return gulp.src(paths.src.vendorScripts, {
        base: 'app/assets/scripts'
    }).pipe(gulp.dest(`${distDir}/assets/scripts/`));
};

/**
 * Transpile SCSS to CSS.
 */
const styles = () => {
    return gulp.src(paths.src.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dist.styles))
        .pipe(browserSync.stream());
};

/**
 * Transpile scripts and bundle them (app.min.js).
 */
const scripts = () => {
    return gulp.src(paths.src.scripts)
        .pipe(sourcemaps.init())
        .pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(`${distDir}/`));
};

/**
 * Minify images.
 */
const images = () => {
    return gulp.src(paths.src.images)
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest(paths.dist.images));
};

/**
 * Watch for file changes and reload browser.
 */
const watch = () => {
    gulp.watch(paths.src.scripts,   ['scripts', browserSync.reload]);
    gulp.watch(paths.src.images,    ['images',  browserSync.reload]);
    gulp.watch(paths.src.styles,    ['styles']);
    gulp.watch(paths.src.views,     ['views',   browserSync.reload]);
};

/**
 * Copy the entire "dist" folder into the "docs" folder (for GitHub Pages).
 */
const docs = () => {
    return gulp.src(`${distDir}/**/*`, {
        base: distDir
    })
        .pipe(gulp.dest(docsDir));
};


gulp.task('clean',                      clean);
gulp.task('serve',          ['watch'],  initBrowserSync);
gulp.task('views',                      views);
gulp.task('copyDataDir',                copyDataDir);
gulp.task('vendorScripts',              vendorScripts);
gulp.task('styles',                     styles);
gulp.task('scripts',                    scripts);
gulp.task('images',                     images);
gulp.task('watch',                      watch);
gulp.task('docs',                       docs);
gulp.task('default',        ['clean'],  serve());