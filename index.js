'use strict';
/*
 * gulp-ng-template
 * https://github.com/teambition/gulp-ng-template
 *
 * Copyright (c) 2014 Yan Qing
 * Licensed under the MIT license.
 */

var util = require('util');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');
var packageName = require('./package.json').name;

module.exports = function(options) {
  options = options || {};

  var standalone = options.standalone ? ', []' : '';
  var moduleName = options.moduleName || 'ngTemplates';
  var filePath = options.filePath || 'templates.js';
  var prefix = options.prefix || '';
  var joinedContent = '';
  var headerTpl = '\'use strict\';\n\nangular.module(\'<%= module %>\'<%= standalone %>).run([\'$templateCache\', function($templateCache) {\n\n';
  var contentTpl = '  $templateCache.put(\'<%= name %>\', \'<%= content %>\');\n\n';

  var joinedHeader = gutil.template(headerTpl, {module: moduleName, standalone: standalone, file: ''});

  var joinedFile = new gutil.File({
    cwd: __dirname,
    base: __dirname,
    path: path.join(__dirname, filePath)
  });

  function normalizeName(name) {
    return name.replace(/\\/g, '/');
  }

  function normalizeContent(content) {
    return content.toString('utf8').replace(/\'/g, '\\\'').replace(/\r?\n/g, '\\n');
  }

  return through.obj(function (file, encoding, next) {
    if (file.isNull()) return next();
    if (file.isStream()) return this.emit('error', new gutil.PluginError(packageName,  'Streaming not supported'));

    var name = prefix;
	  name += path.relative(file.base, file.path);
    joinedContent += gutil.template(contentTpl, {
      name: normalizeName(name),
      content: normalizeContent(file.contents),
      file: ''
    });
    next();
  }, function () {
    joinedFile.contents = new Buffer(joinedHeader + joinedContent + '}]);');
    this.push(joinedFile);
    this.push(null);
  });
};
