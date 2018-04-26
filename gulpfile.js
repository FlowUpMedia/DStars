'use strict';

const gulp              = require('gulp');                  // Gulp
const sass              = require('gulp-sass');             // Sass
const autoprefixer      = require('gulp-autoprefixer');     // Css Autoprefixe Cross Browser
const concat            = require('gulp-concat');           // Js File Combine
const uglify            = require('gulp-uglify');           // Js Minify 
const clean             = require('gulp-clean');            // Delete Files
const imagemin          = require('gulp-imagemin');         // Image Optimize
const plumber           = require('gulp-plumber');          // Sass Error Don't Stop Watch
const sourcemaps        = require('gulp-sourcemaps');       // Css Maps
const rename            = require('gulp-rename');           // Css Maps
const browserSync       = require('browser-sync').create(); //  Sync with the browser

// Usefull packages
// const notify          = require('gulp-notify');           // Notifications
// const jshint          = require('gulp-jshint');           // Js Review


/*
    ***** Functions *****
    gulp.task   - Define tasks
    gulp.src    - Point to file to use
    gulp.dest   - Point to folder to output
    gulp.watch  - Watch files and folder for changes

*/


// 
// Sass Compilation
//
gulp.task('sass', function () {
    gulp.src('src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(autoprefixer('last 2 versions'))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest('build/assets/css'))
        // .pipe(browserSync.stream());
});

// 
// Scripts Compilation
// 
gulp.task('scripts', function () {
    gulp.src('src/js/*.js')
        .pipe(plumber())
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'))
        // .pipe(browserSync.stream());
});

// 
// Scripts Compilation
// 
gulp.task('vendorScripts', function () {
    gulp.src([
            'node_modules/jquery/dist/jquery.slim.min.js',
            'node_modules/popper.js/dist/umd/popper.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
        .pipe(plumber())
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/assets/js'))
        // .pipe(browserSync.stream());
});

// 
// Copy Fontawesome Webfonts
// 
gulp.task('copyFonts', function () {
    gulp.src([
        'node_modules/@fortawesome/fontawesome-free-webfonts/webfonts/*'
    ])
        .pipe(gulp.dest('build/assets/webfonts'));
});

// 
// Copy images and optimize
// 
gulp.task('image', function () {
    gulp.src('src/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('build/assets/img'))
        // .pipe(browserSync.stream());
});

// 
// Clean Up Assets
// 
gulp.task('d', function () {
    gulp.src(['build/assets'], {read: false})
        .pipe(clean());
});

// 
// Watch All
// 
gulp.task('w', function () {
    browserSync.init({
        // PHP files
        // open: 'external',
        // host: 'bstarterkit.local',
        // proxy: "http://bstarterkit.local/",
        server: "./build",
        // open: false,
        notify: false
    });

    gulp.watch(['src/scss/**'], ['sass']);
    gulp.watch(['src/js/*.js'], ['scripts']);
    gulp.watch([
        'build/*.html',
        'build/assets/css/*.css',
        'build/assets/js/*.js'
    ]).on('change', browserSync.reload);
});

// 
// Gulp Default Task
//
gulp.task('default', ['sass', 'scripts', 'vendorScripts', 'image', 'copyFonts']);