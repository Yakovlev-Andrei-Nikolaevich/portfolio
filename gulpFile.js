const { src, dest, watch, parallel } = require('gulp');
const concat = require('gulp-concat');
const webpack = require('webpack-stream');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();

function styles() {
    return src(['src/scss/*.scss', '!src/scss/_*.scss'])
        .pipe(scss({ outputStyle: 'expanded' }))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 5 versions'],
            cascade: true
        }))
        .pipe(concat('main.css'))
        .pipe(dest('docs/css/'));
}

function html() {
    return src('src/*.html')
        .pipe(dest('docs/'));
}

function js() {
    return src('src/js/*.js')
        .pipe(webpack())
        .pipe(concat('main.js'))
        .pipe(dest('docs/js/'));
}

function images() {
    return src('src/images/**/*')
        .pipe(imagemin())
        .pipe(dest('docs/images/'));
}

function watching() {
    watch('src/scss/*.scss', parallel(styles));
    watch('src/*.html', parallel(html));
    watch('src/js/*.js', parallel(js));
    watch('src/images/**/*', parallel(images));
}

function server() {
    browserSync.init({
        server: {
            baseDir: './docs/'
        }
    });
}

exports.build = parallel(styles, html, js, images);
exports.default = parallel(exports.build, server, watching);