# GoogleChartDashboard
A fully-customizable dashboard control that connects to a SQL-based database API (e.g. Google Sheets API) and organizes data across multiple columns with interactive filters. It uses chart objects from [Google Chart] (pie, column, geo) and has options for custom charts, searches, and range filters.

### Requirements
GoogleChartDashboard requires all the following for initializing [Google Chart]:
* [Jquery] (1.12.0 recommended)
* [Google Loader]
* [jsapi]
* [GoogleChartDashboard]

[google chart]: https://developers.google.com/chart/
[jquery]: https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js
[google loader]: https://www.gstatic.com/charts/loader.js
[jsapi]: https://www.google.com/jsapi
[googlechartdashboard]: https://github.com/mekmarriott/GoogleChartDashboard

Loading the libraries:
```javascript
<script type="text/javascript" src="https://www.google.com/jsapi"></script>
<script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
<script src="GoogleChartDashboard.js"></script>
```
### Initialization
Load google visualization package with necessary charts
```javascript 
google.load('visualization', '1', { packages: ['table','corechart','geochart'] }); 
```
Create the Google Charts Dashboard object with desired options 
```javascript
var gcd = new GoogleChartDashboard(categoryFilters, rangeFilters, searchFilters, sheetTableURL, miscOptions);
```
Initialize HTML objects for each chart and remove-filter-button, including
```
<div id="sample-chart"></div>
<button id="sample-chart-remove-filter" onclick="removeFilter('sample-chart')" style="display:none;"></div>
```
```javascript
function removeFilter(filterID){ gcd.removeFilter(filterID) }
```
Set callback for google as a method that will call 'updateAll' on the dashboard object 
```javascript
google.setOnLoadCallback(function() {gcd.updateAll();});
```
