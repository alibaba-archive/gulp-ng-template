'use strict';
/*global describe, it, before, after, beforeEach, afterEach, Promise, noneFn*/

var gulp = require('gulp'),
  clean = require('gulp-clean'),
  merge2 = require('merge2'),
  should = require('should'),
  ngTemplate = require('../index'),
  gulpSequence = require('gulp-sequence');

module.exports = function () {

  gulp.task('clean', function () {
    return gulp.src(['test/templates.js', 'test/js'])
      .pipe(clean({force: true}));
  });

  gulp.task('ngTemplate()', function () {
    return gulp.src(['test/a.html', 'test/b.html'])
      .pipe(ngTemplate())
      .pipe(gulp.dest('test'));
  });

  gulp.task('ngTemplate({moduleName: "testModule"})', function () {
    var origin = '';
    return merge2(
      gulp.src('test/templates.js'),
      gulp.src(['test/a.html', 'test/b.html'])
        .pipe(ngTemplate({moduleName: 'testModule'}))
    ).on('data', function (data) {
      if (!origin) origin = data.contents.toString();
      else should(origin.replace('ngTemplates', 'testModule')).be.equal(data.contents.toString());
    });
  });

  gulp.task('ngTemplate({standalone: true})', function () {
    var origin = '';
    return merge2(
      gulp.src('test/templates.js'),
      gulp.src(['test/a.html', 'test/b.html'])
        .pipe(ngTemplate({standalone: true}))
    )
    .on('data', function (data) {
      if (!origin) origin = data.contents.toString();
      else should(origin.replace('\'ngTemplates\'', '\'ngTemplates\', []')).be.equal(data.contents.toString());
    });
  });

  gulp.task('ngTemplate({filePath: "js/tpl.js"})', function () {
    return gulp.src(['test/a.html', 'test/b.html'])
      .pipe(ngTemplate({filePath: 'js/tpl.js'}))
      .pipe(gulp.dest('test'));
  });

  gulp.task('compare', function () {
    var files = [];
    return merge2(gulp.src('test/templates.js'), gulp.src('test/js/tpl.js'))
      .on('data', function (data) {
        files.push(data.contents.toString());
      })
      .on('end', function () {
        should(files[0]).be.equal(files[1]);
      });
  });
  
  gulp.task('ngTemplate({prefix: "/app/" , filePath: "js/subfolder.tpl.js"})', function(){
	return gulp.src(['test/**/*.html'])
		.pipe(ngTemplate({prefix: '/app/', filePath: 'js/subfolder.tpl.js'}))
		.pipe(gulp.dest('test'));
  });
  
  gulp.task('comparePrefix', function(){
	var files = [];
	return merge2(gulp.src('test/js/subfolder.tpl.js'), gulp.src('test/subfolder/expected.subfolder.tpl.js'))
		.on('data', function(data){
			files.push(data.contents.toString());
		})
		.on('end', function(){
			should(files[0]).be.equal(files[1]);
		});
  });

  gulp.task('test', gulpSequence(
    'clean',
    'ngTemplate()',
    'ngTemplate({moduleName: "testModule"})',
    'ngTemplate({standalone: true})',
    'ngTemplate({filePath: "js/tpl.js"})',
    'compare',
    'clean'
  ));
  
  gulp.task('testSubFolders', gulpSequence(
	'clean',
	'ngTemplate({prefix: "/app/" , filePath: "js/subfolder.tpl.js"})',
	'comparePrefix',
	'clean'
  ));

};
