'use strict';
let gulp = require('gulp'),
    watcher = require('gulp-watch'), // Rebuild only changed files
    plumber = require('gulp-plumber'), // Protect from exit on error
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    exec = require('child_process').exec,
    bs = require("browser-sync").create(),
    argv = require('yargs').argv;


let config = getConfig();
let path = config.path;

// CSS task
function css() {
    return gulp
        .src(path.styles.scss_input)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass()).on('error', sass.logError)
        .pipe(prefixer())
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(path.styles.dst_dir))
        .pipe(bs.stream());
}

// JS task
function js() {
    let min = argv.min;

    let process = gulp
        .src(path.js.src)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(concat(path.js.dst_file));

    if (min) {
        process
            .pipe(uglify())
    }

    process
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(path.js.dst_dir))
        .pipe(bs.stream());
    return process;
}

function clearcache(done) {
    exec('lando drush cr', function (err, stdout, stderr) {
        console.log('\x1b[36m%s\x1b[0m', stderr.trim());
        done(err);
    });
}

// BrowserSync
function browserSync(done) {
    bs.init({
        proxy: config.site_name,
        port: config.bs_port,
        open: false,
        ui: {
            port: config.bs_port + 1
        },
    });
    done();
}

// BrowserSync
function reloadBrowserSync(done) {
    bs.reload();
    done();
}

// Watch files
function watchFiles() {
    watcher([path.styles.scss], gulp.series('css'));
    watcher([path.js.src], gulp.series('js'));
    watcher([path.template], gulp.series('clearcache', 'reloadBrowserSync'));
}

const build = gulp.series(gulp.parallel(css, js), clearcache);
const watch = gulp.series(gulp.parallel(css, js), gulp.parallel(watchFiles, browserSync));

function getConfig(done) {
    try {
        console.log('tetetwt');
        let config = require('./config.js');
        if (typeof config !== 'undefined') {
            console.log('\x1b[36m%s\x1b[0m', 'Config file is ok');
            return config;
            done();
        }
    }
    catch (e) {
        console.log('\x1b[41m', 'Wrong or missing config\'s file. Please, check that the file `config.js` exists in the gulp folder and has right format.', '\x1b[0m');
    }

}

exports.css = css;
exports.js = js;
exports.clearcache = clearcache;
exports.reloadBrowserSync = reloadBrowserSync;
exports.build = build;
exports.watch = watch;
exports.default = watch;
