//Add all the tasks to run in gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer')

var reload = browserSync.reload;

//all the files in the src folder
var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*.html'
}

//all the files in the app folder
var APPPATH = {
  root : 'app/',
  css : 'app/css',
  js: 'app/js'
}

//Sass Compiling task
gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    //Runs first because it adds the autoprefix
    .pipe(autoprefixer())
    //Runs second because it compiles the sass into minified css
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    //Runs last because it adds all the changes to the destination
    .pipe(gulp.dest(APPPATH.css));
});

gulp.task('copy', function(){
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});

//Browser server with reload
gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

gulp.task('watch', ['serve', 'sass', 'copy'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
});

gulp.task('default', ['watch']);
