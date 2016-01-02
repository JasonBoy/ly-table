# ly-table
Simple Angular Table Directive With Bootstrap Style

This angular directive will create a html table based on the `data` and `columns` and other options.

###Usage
Just import 'angular' , 'angular-sanitize' the `ly-table.js`,  
or for commonjs env, just `require('ly-table')`  

Simple usage
```
  <ly-table data="data" columns="columns" autoEscape="false" init="postInit(ele)" table-class="table-hover"></ly-table>
```

#### Directive options
**data**: [Array] Array from $scope, just an array contains all the data, 
```javescript
$scope.data = [
  {
    name: 'jason',
    age: 10,
    address: 'shanghai'
  }
]
```
**columns**: [Array],Array from $scope, define all the columns how to display and other logic need.
```javascript
$scope.columns = [
  {
    field: 'name', //which is key in 'data' of every row data object, 
    name: 'Age',
    sortable:true, //if this column is sortable
    sortBy:''  //sort by name..., if not provided, will sort by field
    cssClass:'', //css in tbody td
    headCssClass:'', // css in thead th
    autoEscape: false, //auto escape the html in this td or not, 
    //if you need add other directive like ng-click in formatter, 
    //set it to false, default value is true
    formatter:'', //string or function to call to gen the html in the td, 
    //which can compile the html with scope with the help of      
    //[bindHtmlCompile](https://github.com/incuna/angular-bind-html-compile) directive, see demo
  }
];
```

**tableClass**: [String], add additional table css class  
**noStrip**: [String], add bootstrap `table-strip` class  
**autoEscape**: [String] true/false. default false, escape/unescape globally  
**init**: [Function], function to execute after DOM rendered  

###Demo###
See the demo in demo folder
