var sass      = require('gulp-sass');
var gulp         = require('gulp');
var notify       = require('gulp-notify');
var handleErrors = require('../util/handleErrors');
var filter      = require('gulp-filter');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

gulp.task('sass', function() {
    return  gulp.src('./app/assets/styles/**/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({
                includePaths: require('node-neat').includePaths
            }))
            .on('error', handleErrors)
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./build/assets/css'))
            .pipe(filter('**/*.css'))
            .pipe(reload({stream:true}));   
})


