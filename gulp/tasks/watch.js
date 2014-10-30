var gulp       = require('gulp');
var livereload = require('gulp-livereload');
var browserSync = require('browser-sync');

gulp.task('watch', ['browser-sync'], function() {
	var server = livereload();

	var reload = function(file) {
		server.changed(file.path);
	}

	gulp.watch('app/assets/styles/**', ['sass']);
	gulp.watch('app/assets/img/**', ['images']);
	gulp.watch(['build/**.{js, html}']).on('change', browserSync.reload);
});
