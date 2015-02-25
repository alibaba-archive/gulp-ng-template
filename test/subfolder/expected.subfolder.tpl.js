'use strict';

angular.module('ngTemplates').run(['$templateCache', function($templateCache) {

  $templateCache.put('/app/a.html', '<div class="test">A</div>\n');

  $templateCache.put('/app/b.html', '<div class="test">\n  <span>B</span>\n</div>\n');

  $templateCache.put('/app/subfolder/c.html', '<div class="test">C</div>\n');

  $templateCache.put('/app/subfolder/d.html', '<div class="test">\n  <span>D</span>\n</div>\n');

}]);