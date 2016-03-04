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
Create the Google Charts Dashboard object with desired options - see `Configruation` below for more information on each of the arguments
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
### Database API Connection
The Google Charts Dashboard currently supports the [Google Sheets] API (and in future versions, arbitrary SQL-based database APIs). Simply include the sheet url in the options for the GoogleChartDashboard Constructor. This should be in the format: `https://docs.google.com/spreadsheets/d/[google_sheets_ID_number]/gviz/tq?gid=0&headers=1&tq=`
[google sheets]: https://www.google.com/sheets/about/

### Configuration
#### Category Filters
This object maps all the google chart ids (distinct chart selector filters) to its respective configurations, which are listed below:

**Required**
* `querySelector` sql column name to extract chart information from
* `chartElement` div id in which to draw the chart/selector
* `filterElement` div/button/input id in which to draw the interactive button to remove a filter
* `chartType` type of google chart - currently supported chart types include [geo], [column], [pie], and custom. example code for a simple pie and custom chart are shown below. 
[geo]: https://google-developers.appspot.com/chart/interactive/docs/gallery/geochart
[column]: https://google-developers.appspot.com/chart/interactive/docs/gallery/columnchart
[pie]: https://google-developers.appspot.com/chart/interactive/docs/gallery/piechart

**Optional**
* `options` options passed in for the corresponding google chart, see the respective chart page for further specifications
* `stacked` true/false - default is false. this indicates whether there is a 2-level hierarchical organization in the data. must be accompanied by a `superToSubCategory` and `subToSuperCategory` (included in `miscOptions`)
* `multiCategory` true/false - default is false. this indicates whether there are multiple categories included in each data row, separated using " | "
* `queryFilter` string for a pre-set filter on the data column - default is null
* `_stackedValue` string for a pre-set super filter on the data column - default is null and `stacked` must be enabled
* `customFunction` function that is called if the filter is specified as 'custom,' default is null

### Range Filters
This object maps all the range ids (distinct range filters) to its respective configurations, which are listed below.

**Required**
* `querySelector` sql column name to extract chart information from
* `defaultTop` default (and upper bound) on the range for the data column
* `defaultBottom` default (and lower bound) on the numerical range for the data column

**Optional**
* `valueTop` pre-set upper bound on the range for the data column
* `valueBottom` pre-set lower bound on the range for the data column

Ranges affect the google chart visualizations, but must be handled client side through updating the object range filters and updating through the Dashboard properties. An example is given below:
```javascript
gcd.rangeFilters[filterID].valueTop = 89;
gcd.rangeFilters[filterID].valueBottom = 34;
gcd.updateAll();
```

### Search Filters
This object maps all the search ids (distinct search filters) to its respective configurations, which are listed below.

**Required**
* `querySelector` sql column name to extract chart information from the data column

### Google Sheet URL
See `Database API Connection` above to see which url to input for this argument

### Miscellaneous Filters
**Required**
* `createFilterFuncion` function that is called when adding a filter-to-remove button (generates the html inside the div/button/input specified by `filterElement`)

**Optional**
* `superToSubCategory` this object maps all category ids to another object, which maps all super-categories to an array of its sub-categories
* `subToSuperCategory` this object maps all category ids to another object, which maps all sub-categories to its super-category
* `extraColumns` additional data columns to retrieve with each request
* `updateFunction` custom function that is called at each update (in addition to the default)

