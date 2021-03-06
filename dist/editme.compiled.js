'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function (root, factory) {
  // AMD
  if (typeof define === 'function' && define.amd) {
    define(['angular'], function (angular) {
      return factory(angular);
    });
  }
  // Node.js
  else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
      module.exports = factory(require('angular'));
    }
    // Angular
    else if (angular) {
        factory(root.angular);
      }
})(window, function (angular) {
  'use strict';

  var m = angular.module('shaka-editme', []);

  /**
   * Component wrapper for SVG edit icon
   */
  m.component('skEditmeIcon', {
    template: '\n      <div class="icon-wrapper">\n        edit-icon\n        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" viewBox="0 0 32 32">\n          <path d="M30.173 7.542l-0.314 0.314-5.726-5.729 0.313-0.313c0 0 1.371-1.813 3.321-1.813 0.859 0 1.832 0.353 2.849 1.37 3.354 3.354-0.443 6.171-0.443 6.171zM27.979 9.737l-19.499 19.506-8.48 2.757 2.756-8.485v-0.003h0.002l19.496-19.505 0.252 0.253zM2.76 29.239l4.237-1.219-2.894-3.082-1.343 4.301z"></path>\n        </svg>\n      </div>\n    '
  });

  m.directive('skEditme', function ($compile, $timeout) {
    var directive = {
      scope: {
        isEditing: '=?',
        hideIcon: '<?',
        submitOnEnterKey: '<?',
        submitOnBlur: '<?',
        onStateChange: '&?',
        onInvalid: '&?',
        onChange: '&?'
      },
      controller: function controller($scope) {
        $scope.toggleEdit = function (value) {
          $scope.isEditing = typeof value !== 'undefined' ? Boolean(value) : !$scope.isEditing;
        };
      },
      link: link,
      transclude: {
        static: '?static',
        editable: '?editable'
      },
      template: '\n        <div ng-click="toggleEdit(true)" ng-class="{\'editme-touch\': isTouchEnabled}">\n          <span ng-hide="isEditing" class="model-wrapper" ng-class="{\'hide-icon\': hideIcon}">\n            <span class="model-content" ng-transclude="static">{{model}}</span>\n            <sk-editme-icon ng-if="!isEditing && !hideIcon"></sk-editme-icon>\n          </span>\n          <div ng-transclude="editable" ng-show="isEditing"></div>\n        </div>\n      '
    };

    return directive;

    function link(scope, element, attrs, ctrl, transclude) {
      var $input = undefined;
      var ngModel = undefined;
      var prevValue = undefined;
      var KEYS = {
        ENTER: 13
      };
      var VALID_ELEMENTS = ['input[type="text"]', 'input[type="url"]', 'input[type="date"]', 'input[type="email"]', 'input[type="week"]', 'input[type="month"]', 'input[type="number"]', 'input[type="time"]', 'textarea'];

      if ('ontouchstart' in document.documentElement) {
        scope.isTouchEnabled = true;
      }

      scope.submitOnEnterKey = typeof scope.submitOnEnterKey !== 'undefined' ? scope.submitOnEnterKey : true;
      scope.submitOnBlur = typeof scope.submitOnBlur !== 'undefined' ? scope.submitOnBlur : true;

      $timeout(function () {
        // This will ensure only valid elements are matched
        var input = element[0].querySelectorAll(VALID_ELEMENTS.join(','));

        if (input.length !== 1) {
          throw new Error('skEditme could not find valid input or textarea element. Please see docs for valid element types.');
        }

        $input = angular.element(input[0]);
        ngModel = $input.controller('ngModel');

        // Throw error/warning if invalid element provided
        if (angular.isUndefined(ngModel)) {
          throw new Error('skEditme transcluded element is missing required ng-model directive');
        }

        // If the submitOnBlur is disabled, activate the submit button
        if (scope.submitOnBlur === false) {
          var submit = element[0].querySelectorAll('button[type="submit"]');
          if (submit.length !== 1) {
            throw new Error('skEditme could not find a valid submit button near ' + input[0].outerHTML);
          } else {
            angular.element(submit[0]).on('click', validate);
          }
        }

        // ngModel.$modelView will be initialized as NaN
        // This ensures we don't initiate our scope.model with NaN
        var disconnect = scope.$watch(function () {
          return ngModel.$modelValue;
        }, function (value) {
          // isNaN doesn't work see http://stackoverflow.com/questions/2652319/how-do-you-check-that-a-number-is-nan-in-javascript
          var isNotNum = value !== value;

          if (!isNotNum) {
            scope.model = value;
            scope.$watch(function () {
              return scope.isEditing;
            }, onIsEditingChange);
            disconnect();
          }
        });

        ngModel.$viewChangeListeners.push(function () {
          scope.model = ngModel.$modelValue;
        });
      });

      function onIsEditingChange(value, prevValue) {
        if (value === prevValue) return;

        if (value) {
          $timeout(function () {
            return $input[0].focus();
          });
          $input.on('blur keypress', validate);
        } else {
          $input.off('blur keypress', validate);
        }

        if (scope.onStateChange) {
          scope.onStateChange({ $isEditing: angular.copy(value) });
        }

        if (scope.onChange && value === false && typeof scope.model !== 'undefined') {
          scope.onChange({ $value: angular.copy(scope.model) });
        }
      }

      function validate(evt) {
        if (scope.submitOnBlur && evt.type === 'blur' || !scope.submitOnBlur && evt.type === 'click' || scope.submitOnEnterKey && evt.keyCode === KEYS.ENTER) {
          evt.stopPropagation();
          scope.isEditing = ngModel.$invalid && ngModel.$dirty;
          scope.$apply();

          if (ngModel.$error && scope.onInvalid) {
            scope.onInvalid({ $error: angular.copy(ngModel.$error) });
          }
        }
      }
    }
  });

  return m.name;
});

//# sourceMappingURL=editme.compiled.js.map