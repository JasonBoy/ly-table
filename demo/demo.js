
angular.module('demo', ['lyTable'])
    .controller('Demo', function($scope) {

      $scope.data = [
        {
          name: 'jason',
          age: 10,
          address: '<p>shanghai <a ng-click="column.testClick(item, rowIndex, columnIndex)">click</a></p>'
        },
        {
          name: 'emily',
          age: 10,
          address: '<p>shanghai china 2</p>'
        }
      ];

      $scope.columns = [
        {
          field: 'name',
          name: 'Username',
          formatter: simpleFormatter
        },
        {
          field: 'age',
          name: 'Age',
          formatter: simpleFormatter
        },
        {
          field: 'address',
          name: 'Address',
          autoEscape: true,
          formatter: simpleFormatter,
          cssClass: 'text-center',
          headCssClass: 'text-center',
          testClick: function(rowData, rowindex, columnindex) {
            console.log(arguments);
          }
        }
      ];
      $scope.postInit = function(ele) {
        console.log('postInit');
      };
      function simpleFormatter(fieldData, rowData, columnDefinition) {
        return fieldData;
      }
    });

