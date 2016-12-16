var gulp = require('gulp');
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var imagemin = require('gulp-imagemin');
var minifyHTML = require('gulp-minify-html');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var amdOptimize = require("amd-optimize");
// var requirejsOptimize = require('gulp-requirejs-optimize');

// JS hint task
gulp.task('jshint', function() {
  gulp.src('./public/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('imagemin', function() {
  var imgSrc = './public/images/**/*',
      imgDst = './build/images';

  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});

// minify new or changed HTML pages
gulp.task('htmlpage', function() {
  var htmlSrc = './public/*.html',
      htmlDst = './build';

  gulp.src(htmlSrc)
    .pipe(changed(htmlDst))
    .pipe(minifyHTML())
    .pipe(gulp.dest(htmlDst));
});

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src([
      './public/scripts/**/*.js'
    ])
    .pipe(amdOptimize("main",{
        configFile: './public/scripts/main.js',
        findNestedDependencies: true
    }))
    .pipe(concat('main.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts'));
});

// CSS concat, auto-prefix and minify
gulp.task('styles', function() {
  gulp.src(['./public/css/*.css'])
    .pipe(concat('styles.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/styles/'));
});

gulp.task('default', ['imagemin', 'htmlpage', 'scripts', 'styles'], function() {
});
