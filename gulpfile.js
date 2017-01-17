//Add all the tasks to run in gulp
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

var reload = browserSync.reload;

//all the files in the src folder
var SOURCEPATHS = {
  sassSource : 'src/scss/*.scss',
  htmlSource : 'src/*.html',
  jsSource : 'src/js/**',
  imgSource : 'src/img/**'
}

//all the files in the app folder
var APPPATH = {
  root : 'app/',
  css : 'app/css',
  js: 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
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

gulp.task('clean-css', function(){
  return gulp.src(APPPATH.css + '/*css', {read: false, force:true})
    .pipe(clean());
});

gulp.task('clean-images', function(){
  return gulp.src(APPPATH.img + '/**', {read: false, force:true})
    .pipe(clean());
});

//---- Sass compiling

gulp.task('sass', ['clean-css'], function(){
  var bootstrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css');
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sassSource)
    //Runs first because it adds the autoprefix
    .pipe(autoprefixer())
    //Runs second because it compiles the sass into minified css
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))

    return merge(bootstrapCSS, sassFiles)
    .pipe(concat('app.css'))
    //Runs last because it adds all the changes to the destination
    .pipe(gulp.dest(APPPATH.css));
});


//---- Image minification task
gulp.task('images', function(){
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img))
    .pipe(imagemin())
    .pipe(gulp.dest(APPPATH.img));
});



//---- Move bootstrap fonts
gulp.task('moveFonts', function(){
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}')
  .pipe(gulp.dest(APPPATH.fonts));
});

//---- Listen and copy new files
gulp.task('scripts', ['clean-scripts'], function(){
  gulp.src(SOURCEPATHS.jsSource)
    .pipe(concat('main.js'))
    .pipe(browserify())
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

gulp.task('watch', ['serve', 'sass', 'clean-css', 'copy', 'clean-html', 'clean-scripts', 'scripts', 'moveFonts', 'images', 'clean-images'], function(){
  gulp.watch([SOURCEPATHS.sassSource], ['sass']);
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']);
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']);
});

//---- Add the watch task to the default Gulp command

gulp.task('default', ['watch']);
