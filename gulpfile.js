var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    //less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer'),
    //plumber = require('gulp-plumber'),
    browserSync = require('browser-sync').create(),
    notify = require('gulp-notify'),
    concat = require('gulp-concat'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    //base64 = require('gulp-base64'),
    imagemin = require('gulp-imagemin'),
    //cache = require('gulp-cache'),
    del = require('del'),
    zip = require('gulp-zip');
    //runSequence = require('run-sequence');

var config={
        src:'./src/'
    };

// styles --sass task
gulp.task('styles', function(){
    gulp.src('./src/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['> 5%'],
            cascade: false
        })) 
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/css/'))
        //.pipe(rename({suffix: '.min'}))
        //.pipe(minifycss())
        //.pipe(gulp.dest('./dist/assets/css'))
        .pipe(notify({ message: '( ゜- ゜)つロ 乾杯~ Styles task complete' }));
});

//js
//Concat minify
gulp.task('script', function(){
    gulp.src('./src/js/**/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist/js/'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js/'))
        .pipe(notify({ message: '( ゜- ゜)つロ 乾杯~ Scripts task complete' }));
});

//optimize js css
gulp.task('optimize', function(){ 
    gulp.src('src/html/*.html') 
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano())) 
        .pipe(gulp.dest('dist'))
        .pipe(notify({ message: '( ゜- ゜)つロ 乾杯~ optimize task complete' }));
});

//images
gulp.task('images', function(){
    gulp.src('src/images/**/*')
        .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
        .pipe(gulp.dest('./dist/images/'))
        .pipe(notify({ message: '( ゜- ゜)つロ 乾杯~ images task complete' }));
});

//copy
gulp.task('copy', function(){
    gulp.src(['./src/**/*', '!src/css/**/*.scss'])
        .pipe(gulp.dest('./dist'));
});

//browserSync
gulp.task('browserSync', function() { 
    browserSync.init({ 
        server: {
           baseDir: './dist' 
        },
        logLevel: "debug",
        logPrefix: "dev",
        browser: "google chrome"
    });
});

//clean dist
gulp.task('clean', function(cb) { 
    del.sync('./dist');
});

//zip
gulp.task('zip', function() {
    gulp.src('dist/**')
        .pipe(zip('project.zip'))
        .pipe(gulp.dest('/Users/deantg/Desktop/'))
        .pipe(notify({ message: '( ゜- ゜)つロ 乾杯~ zip task complete' }));
});

//watch
gulp.task('watch', ['browserSync', 'styles', 'copy'], function() {
    gulp.watch('./src/css/**/*.scss', ['styles']); 
    gulp.watch(['./src/html/*.html','./src/css/*.css','./src/js/**/*.js','./src/images/**/*'], ['copy']); 
    gulp.watch(['./src/**']).on('change',function(){
        browserSync.reload();
    });
});

//task default
gulp.task('default',['clean', 'copy', 'styles']);
     