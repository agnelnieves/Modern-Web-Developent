//Add all the tasks to run in gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');

var reload = browserSync.reload;

//all the files in the src folder
var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*.html',
  jsSource : 'src/js/**'
}

//all the files in the app folder
var APPPATH = {
  root : 'app/',
  css : 'app/css',
  js: 'app/js'
}

//---- Listen and clean deleted files
gulp.task('clean-html', function(){
  return gulp.src(APPPATH.root + '/*html', {read: false, force:true})
    .pipe(clean());
});

gulp.task('clean-scripts', function(){
  return gulp.src(APPPATH.js + '/*js', {read: false, force:true})
    .pipe(clean());
});

//---- Sass compiling

gulp.task('sass', function(){
  return gulp.src(SOURCEPATHS.sassSource)
    //Runs first because it adds the autoprefix
    .pipe(autoprefixer())
    //Runs second because it compiles the sass into minified css
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    //Runs last because it adds all the changes to the destination
    .pipe(gulp.dest(APPPATH.css));
});

//---- Listen and copy new files

gulp.task('scripts', ['clean-scripts'], function(){
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(gulp.dest(APPPATH.js))
})

gulp.task('copy', ['clean-html'], function(){
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});

//---- Serve and reload browser
gulp.task('serve', ['sass'], function(){
  browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
    server: {
      baseDir : APPPATH.root
    }
  })
});

//---- Concatenate tasks on a single task

gulp.task('watch', ['serve', 'sass', 'copy', 'clean-html', 'clean-scripts', 'scripts'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

//---- Add the watch task to the default Gulp command

gulp.task('default', ['watch']);
