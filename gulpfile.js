/*global require:true */
(function () {
  'use strict';

  var gulp = require('gulp');
  var rename = require('gulp-rename');
  var uglify = require('gulp-uglify');
  var jshint = require('gulp-jshint');
  var concat = require('gulp-concat');
  var shell = require('gulp-shell');

  var DEST = 'build/';

  gulp.task('default', function () {
    return gulp.src(['storage.js'])
      .pipe(jshint())
      .pipe(jshint.reporter('default'))
      .pipe(gulp.dest(DEST))
      .pipe(uglify({preserveComments: 'some'}))
      .pipe(rename({extname: '.min.js'}))
      .pipe(gulp.dest(DEST));
  });

  gulp.task('watch', function () {
    gulp.watch('*.js', ['default']);
  });
}());