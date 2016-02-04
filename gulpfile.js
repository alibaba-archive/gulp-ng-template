'use strict'

var gulp = require('gulp')
var gulpSequence = require('gulp-sequence')

require('./test/index')

gulp.task('default', gulpSequence('test'))
