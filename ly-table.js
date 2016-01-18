/**
 * @license MIT
 * Simple Angular Table Directive without pagination,
 * https://github.com/JasonBoy/ly-table
 */

(function (window, angular) {
  'use strict';
  var app = angular.module('lyTable', ['ngSanitize']);

  var template = '<div class="ly-table-wrapper">' +
    '<table class="table data-table {{tableClass}}">' +
    '<thead>' +
    '<tr>' +
    '<th ng-class="column.headCssClass" ng-repeat="column in ::columns">' +
    '<span ng-class="{\'active\':column.sortActive,\'sortable\':column.sortable}"' +
    'ng-click="sort(column)">' +
    '<span bind-html-compile="columnName(column)"></span>' +
    '</span>' +
    '</th>' +
    '</tr>' +
    '</thead>' +
    '<tbody>' +
    '<tr class="table-row" ng-repeat="item in data track by $index" ng-init="rowIndex = $index">' +
    '<td ng-class="column.cssClass" ng-repeat="column in ::columns" ng-init="columnIndex = $index"' +
    'bind-html-compile="displayContent(column.formatter, item[column.field], item, column)">' +
    '</td>' +
    '</tr>' +
    '</tbody>' +
    '</table>' +
    '</div>'
    ;


  /**
   * Data table ui directive
   * ============ columns ===============
   [
     {
       field:'', //key in json result ,
       name:'',  // text in header th
       sortable:true, //if this column is sortable
       sortBy:''  //sort by name..., if not provided, will sort by field
       cssClass:'', //css in tbody td
       headCssClass:'', // css in thead th
       autoEscape: 'false',
       formatter:'', //function to call to gen the html in the td,
       ..., other needed functions passed
     }.....
   ]
   *
   */
  app.directive('lyTable', [
    '$timeout',
    '$sce',
    '$filter',
    function ($timeout, $sce, $filter) {
      return {
        restrict: 'EA',
        scope: {
          columns: '=', //columns definition, @see above format
          data: '=', //json data from outside
          tableClass: '@', // css class for the whole table
          autoEscape: '@'
        },
        replace: true,
        template: template,
        controller: ['$scope', function ($scope) {
          var escapeHtml = $filter('linky');
          $scope.columnName = function (column) {
            return noEscape(column) ? column.name : escapeHtml(column.name);
          };
          $scope.displayContent = function (formatter, fieldData, rowData, column) {
            var html = '';
            if ('function' === typeof formatter) {
              html = formatter.call(rowData, fieldData, column);
            }
            else {
              html += formatter;
            }
            //return html;
            html = html.toString();
            if (noEscape(column)) {
              return html;
            }
            return escapeHtml(html);
          };
          $scope.normalizeSortField = function () {
            for (var i in $scope.columns) {
              if($scope.columns.hasOwnProperty(i)) {
                var item = $scope.columns[i];
                if (!item.sortBy) {
                  item.sortBy = item.field;
                }
              }
            }
          };
          $scope.sort = function (col) {
            if (!col.sortable) return;
            if(col.hasOwnProperty('sortDir')) {
              col.sortDir = !col.sortDir;
            } else {
              col.sortDir = 1; //1: desc, else asc order
            }
            $scope.columns.forEach(function (ele) {
              ele.sortActive = ele.sortBy == col.sortBy;
            });
            $scope.$emit('sorting', col);
          };
          function noEscape(column) {
            return false === column.autoEscape || 'false' === $scope.autoEscape;
          }
        }],
        link: function ($scope, elem, attrs) {
          $scope.normalizeSortField();
          $scope.$emit('postLinked', elem); //pass element to the event listener
        }
      };
    }]);


  /**
   * @see https://github.com/incuna/angular-bind-html-compile
   */

  app.directive('bindHtmlCompile', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watch(function () {
          return scope.$eval(attrs.bindHtmlCompile);
        }, function (value) {
          // In case value is a TrustedValueHolderType, sometimes it
          // needs to be explicitly called into a string in order to
          // get the HTML string.
          element.html(value && value.toString());
          // If scope is provided use it, otherwise use parent scope
          var compileScope = scope;
          if (attrs.bindHtmlScope) {
            compileScope = scope.$eval(attrs.bindHtmlScope);
          }
          $compile(element.contents())(compileScope);
        });
      }
    };
  }]);
})(window, window.angular);
