'use strict'
/*
 * gulp-ng-template
 * https://github.com/teambition/gulp-ng-template
 *
 * Licensed under the MIT license.
 */

var path = require('path')
var gutil = require('gulp-util')
var through = require('through2')
var packageName = require('./package.json').name

module.exports = function (options) {
  options = options || {}

  var joinedContent = ''
  var useStrict = options.useStrict !== false
  var wrap = options.wrap !== false
  var prefix = options.prefix || ''
  var filePath = options.filePath || 'templates.js'
  var standalone = options.standalone ? ', []' : ''
  var moduleName = options.moduleName || 'ngTemplates'
  var headerTpl = (useStrict ? "'use strict';\n\n" : '') + "angular.module('<%= module %>'<%= standalone %>).run(['$templateCache', function($templateCache) {\n\n"
  var contentTpl = "  $templateCache.put('<%= name %>', '<%= content %>');\n\n"
  var joinedHeader = gutil.template(headerTpl, {module: moduleName, standalone: standalone, file: ''})

  return through.obj(function (file, encoding, next) {
    if (file.isNull()) return next()
    if (file.isStream()) return this.emit('error', new gutil.PluginError(packageName, 'Streaming not supported'))

    var name = prefix
    name += path.relative(file.base, file.path)
    joinedContent += gutil.template(contentTpl, {
      name: normalizeName(name),
      content: normalizeContent(file.contents),
      file: ''
    })
    next()
  }, function (callback) {
    var contents = joinedHeader + joinedContent + '}]);'
    if (wrap) contents = ';(function(){\n\n' + contents + '\n\n})();'
    this.push(new gutil.File({base: '', path: filePath, contents: new Buffer(contents)}))
    callback()
  })
}

function normalizeName (name) {
  return name.replace(/\\/g, '/')
}

function normalizeContent (content) {
  return content.toString().replace(/'/g, "\\'").replace(/\r?\n/g, '\\n')
}
