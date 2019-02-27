'use strict'
/*
 * gulp-ng-template
 * https://github.com/teambition/gulp-ng-template
 *
 * Licensed under the MIT license.
 */

const path = require('path')
const through = require('through2')
const Vinyl = require('vinyl')
const PluginError = require('plugin-error')
const template = require('lodash.template')
const reEscape = require('lodash._reescape')
const reEvaluate = require('lodash._reevaluate')
const reInterpolate = require('lodash._reinterpolate')
const packageName = require('./package.json').name

const forcedSettings = {
  escape: reEscape,
  evaluate: reEvaluate,
  interpolate: reInterpolate
}

module.exports = function (options) {
  options = options || {}

  let joinedContent = ''
  const useStrict = options.useStrict !== false
  const wrap = options.wrap !== false
  const prefix = options.prefix || ''
  const filePath = options.filePath || 'templates.js'
  const standalone = options.standalone ? ', []' : ''
  const moduleName = options.moduleName || 'ngTemplates'
  const headerTpl = (useStrict ? "'use strict';\n\n" : '') + "angular.module('<%= module %>'<%= standalone %>).run(['$templateCache', function($templateCache) {\n\n"
  const contentTpl = "  $templateCache.put('<%= name %>', '<%= content %>');\n\n"
  const joinedHeader = wrappedTpl(headerTpl, {
    module: moduleName,
    standalone: standalone,
    file: ''
  })

  return through.obj(function (file, _encoding, next) {
    if (file.isNull()) {
      return next()
    }
    if (file.isStream()) {
      return this.emit('error', new PluginError(packageName, 'Streaming not supported'))
    }

    let name = prefix
    name += path.relative(file.base, file.path)
    joinedContent += wrappedTpl(contentTpl, {
      name: normalizeName(name),
      content: normalizeContent(file.contents),
      file: ''
    })
    next()
  }, function (callback) {
    let contents = joinedHeader + joinedContent + '}]);'
    if (wrap) contents = ';(function(){\n\n' + contents + '\n\n})();'
    this.push(new Vinyl({
      base: null,
      path: filePath,
      contents: Buffer.from(contents)
    }))
    callback()
  })
}

function normalizeName (name) {
  return name.replace(/\\/g, '/')
}

function normalizeContent (content) {
  return content.toString().replace(/'/g, "\\'").replace(/\r?\n/g, '\\n')
}

function wrappedTpl (tmpl, data) {
  const fn = template(tmpl, forcedSettings)

  function wrapped (o) {
    if (typeof o === 'undefined' || typeof o.file === 'undefined') {
      throw new Error('Failed to provide the current file as "file" to the template')
    }
    return fn(o)
  }

  return data ? wrapped(data) : wrapped
}
