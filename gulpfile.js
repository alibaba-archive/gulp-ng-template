'use strict';

var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  gulpSequence = require('gulp-sequence'),
  test = require('./test/index');

gulp.task('jshint', function () {
  return gulp.src(['*.js', 'test/index.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

test();

gulp.task('default', gulpSequence('jshint', 'test'));
