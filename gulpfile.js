var gulp = require('gulp'),
    minify = require('gulp-minify');

gulp.task('compress', function() {
    gulp.src('src/*.js')
        .pipe(minify(

        ))
        .pipe(gulp.dest('dist'))
});

gulp.task('default', ['compress']);
