//Add all the tasks to run in gulp
var gulp = require('gulp');
var sass = require('gulp-sass');

//Sass Compiling task
gulp.task('sass', function(){
  return gulp.src('src/scss/app.scss')
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(gulp.dest('app/css'));
});

gulp.task('default', ['sass']);
