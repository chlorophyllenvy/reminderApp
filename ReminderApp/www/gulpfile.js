var gulp = require('gulp'),
    gutil = require('gulp-util'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngcrush = require('imagemin-pngcrush');
   // combineMq = require('gulp-combine-mq');
 
// gulp.task('combineMq', function () {
//     return gulp.src('test.css')
//     .pipe(combineMq({
//         beautify: false
//     }))
//     .pipe(gulp.dest('tmp'));
// });

gulp.task('css', function () {
  gulp.src('./_src/index.styl')
    .pipe(stylus().on('error', gutil.log))
   // .pipe(combineMq({ beautify: true }).on('error', gutil.log))
    .pipe(autoprefixer('last 3 version', 'Explorer 8').on('error', gutil.log))
    .pipe(gulp.dest('./css/index.css'))
    .pipe(rename({suffix: '.min'} ).on('error', gutil.log))
    .pipe(cssnano().on('error', gutil.log))
    .pipe(gulp.dest('.css/'));
});

gulp.task('js', function() {
  gulp.src(['../shared/js/entryCookie.js', '../shared/js/polyfills.js', '../shared/js/template.js', '../shared/js/helpers.js', '../shared/js/isi.js', './js/site.js'])
    .pipe(concat('site.js'))
    .pipe(gulp.dest('../../assets/js/'))
    .pipe(rename({suffix: '.min'} ))
    .pipe(uglify().on('error', gutil.log))
    .pipe(gulp.dest('../../assets/js/'));
});


gulp.task('watch', function() {
  gulp.watch('./_src/styles/*.styl', ['css'])
    .on('change', function(evt) {
      console.log(evt.type, " ==> ", evt.path);
    });
  gulp.watch('../**/js/*.js', ['js', 'js_edetail', 'managed_js'])
    .on('change', function(evt) {
      console.log(evt.type, " ==> ", evt.path);
    });

});

gulp.task('default', ['css', 'js']);
