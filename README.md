gulp-ng-template
====
Precompile AngularJS templates to a JS file with $templateCache.

[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]

## Install

Install with [npm](https://npmjs.org/package/gulp-ng-template)

```
npm install --save-dev gulp-ng-template
```

## Usage

```js
var minifyHtml = require('gulp-minify-html')
var ngTemplate = require('gulp-ng-template')

gulp.task('templates:dist', function() {
  gulp.src('src/tpl/**/*.html')
    .pipe(minifyHtml({empty: true, quotes: true}))
    .pipe(ngTemplate({
      moduleName: 'genTemplates',
      standalone: true,
      filePath: 'js/templates.js'
    }))
    .pipe(gulp.dest('dist'));  // output file: 'dist/js/templates.js'
})
```

## Demo

test/a.html:

```html
<div class="test">A</div>
```

test/b.html:

```html
<div class="test">
  <span>B</span>
</div>
```

`gulp test`:

```js
gulp.task('test', function () {
  return gulp.src(['test/a.html', 'test/b.html'])
    .pipe(ngTemplate({filePath: 'js/tpl.js'}))
    .pipe(gulp.dest('test'));
})
```

test/js/tpl.js:

```js
'use strict';

angular.module('ngTemplates').run(['$templateCache', function($templateCache) {

  $templateCache.put('a.html', '<div class="test">A</div>\n');

  $templateCache.put('b.html', '<div class="test">\n  <span>B</span>\n</div>\n');

}]);
```


## Options

### moduleName

*Optional*, Type: `String`, Default: `'ngTemplates'`.

Name of the AngularJS module.

### standalone

*Optional*, Type: `Boolean`, Default: `false`.

Create an AngularJS module.

### wrap

*Optional*, Type: `Boolean`, Default: `true`.

wrap the code with IIFE.

### useStrict

*Optional*, Type: `Boolean`, Default: `true`.

'use strict;' will be generated on the top, but if `Options.wrap` is true, it be generated in the IIFE.

### prefix

*Optional*, Type: `String`, Default: `''`.

Add a prefix to $templateCache's key.

```js
gulp.task('test', function () {
  return gulp.src(['test/a.html', 'test/b.html'])
    .pipe(ngTemplate({
      filePath: 'js/tpl.js',
      prefix: '/app/'
    }))
    .pipe(gulp.dest('test'));
})
```

test/js/tpl.js:

```js
'use strict';

angular.module('ngTemplates').run(['$templateCache', function($templateCache) {

  $templateCache.put('/app/a.html', '<div class="test">A</div>\n');

  $templateCache.put('/app/b.html', '<div class="test">\n  <span>B</span>\n</div>\n');

}])
```

### filePath

*Optional*, Type: `String`, Default: `'templates.js'`.

Create a JS file that Joined all template files.


## License

MIT © [Teambition](http://teambition.com)

[npm-url]: https://npmjs.org/package/gulp-ng-template
[npm-image]: http://img.shields.io/npm/v/gulp-ng-template.svg

[travis-url]: https://travis-ci.org/teambition/gulp-ng-template
[travis-image]: http://img.shields.io/travis/teambition/gulp-ng-template.svg
