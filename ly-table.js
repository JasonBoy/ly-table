/*!
 * @license MIT
 * Simple Angular Table Directive without pagination,
 * https://github.com/JasonBoy/ly-table
 */

;!(function (window, angular) {
  'use strict';
  var app = angular.module('lyTable', ['ngSanitize']);
  var template = '<div class="ly-table-wrapper">' +
          '<table class="table {{tableClass}}">' +
          '<thead>' +
          '<tr>' +
          '<th ng-class="column.headCssClass" ng-repeat="column in columns">' +
          '<span ng-class="{\'active\':column.sortActive,\'sortable\':column.sortable}"' +
          'ng-click="sort(column)">' +
          '<span ng-bind-html="columnName(column)"></span>' +
          '</span>' +
          '</th>' +
          '</tr>' +
          '</thead>' +
          '<tbody>' +
          '<tr ng-repeat="item in data track by $index" ng-init="rowIndex = $index">' +
          '<td ng-class="column.cssClass" ng-repeat="column in columns" ng-init="columnIndex = $index"' +
          'ng-bind-html="displayContent(column.formatter, item[column.field], item, column)">' +
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
    '$sce',
    function ($sce) {
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
          $scope.columnName = function (column) {
            return $sce.trustAsHtml(column.name);
          };
          $scope.displayContent = function (formatter, fieldData, rowData, column) {
            var html = '';
            if ('function' === typeof formatter) {
              html = formatter.call(rowData, fieldData, column);
            }
            else {
              html += String(formatter);
            }
            return $sce.trustAsHtml(html.toString());
          };
          $scope.normalizeSortField = function () {
            for (var i in $scope.columns) {
              if ($scope.columns.hasOwnProperty(i)) {
                var item = $scope.columns[i];
                if (!item.sortBy) {
                  item.sortBy = item.field;
                }
              }
            }
          };
          $scope.sort = function (col) {
            if (!col.sortable) return;
            if (col.hasOwnProperty('sortDir')) {
              col.sortDir = !col.sortDir;
            } else {
              col.sortDir = 1; //1: desc, else asc order
            }
            angular.forEach($scope.columns, function (ele) {
              ele.sortActive = ele.sortBy == col.sortBy;
            });
            $scope.$emit('sorting', col);
          };
        }],
        link: function ($scope, elem, attrs) {
          $scope.normalizeSortField();
          $scope.$emit('postLinked', elem); //pass element to the event listener
        }
      };
    }]);
})(window, window.angular);
