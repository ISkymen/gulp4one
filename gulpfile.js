'use strict';
var gulp = require('gulp'),
    watcher = require('gulp-watch'), // Rebuild only changed files
    plumber = require('gulp-plumber'), // Protect from exit on error
    prefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    buffer = require('vinyl-buffer'),
    merge = require('merge-stream'),
    svgSprite = require('gulp-svg-sprite'),
    size = require('gulp-size'),
    exec = require('child_process').exec,
    bs = require("browser-sync").create(),
    argv = require('yargs').argv;


var config = getConfig();
var path = config.path;

// CSS task
function css() {
  return gulp
    .src(path.styles.scss_input)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', sass.logError)
    .pipe(prefixer())
    // .pipe(csscomb())
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest(path.styles.dst_dir))
    .pipe(bs.stream());
}

// JS task
function js() {
    var min = argv.min;

    var process = gulp
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
    exec('cd ' + path.base + ' && drush cr', function (err, stdout, stderr) {
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
  watcher([path.sprite.src_png], 'sprite:png');
  watcher([path.template], gulp.series('clearcache', 'reloadBrowserSync'));
}


const build = gulp.series(gulp.parallel(css, js), clearcache);
const watch = gulp.series(gulp.parallel(css, js), gulp.parallel(watchFiles, browserSync));

            gulp.task('sprite:png', function () {
                var spriteData = gulp.src(path.sprite.src_png)
                    .pipe(spritesmith({
                        imgName: path.sprite.imgName,
                        cssName: path.sprite.cssName,
                        algorithm: 'binary-tree',
                        padding: 2
                    }));
                var imgStream = spriteData.img
                    .pipe(buffer())
                    .pipe(imagemin())
                    .pipe(gulp.dest(path.sprite.dst_img));
                var cssStream = spriteData.css
                    .pipe(gulp.dest(path.sprite.dst_scss));
                return merge(imgStream, cssStream);
            });

                        gulp.task('sprite:svg', function () {
                return gulp.src(path.sprite.src)
                    .pipe(svgSprite({
                        shape: {
                            spacing: {
                                padding: 2
                            }
                        },
                        mode: {
                            css: {
                                dest: "./",
                                layout: "vertical",
                                sprite: path.sprite.svg,
                                bust: false,
                                render: {
                                    scss: {
                                        dest: path.sprite.scss,
                                        template: path.sprite.tpl
                                    }
                                }
                            }
                        },
                        variables: {
                            mapname: "icons"
                        }
                    }))
                    .pipe(gulp.dest(path.base));
            });


function getConfig(done) {
        try {
            var config = require('config.js');
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
