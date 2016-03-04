function GoogleChartDashboard(categoryFilters, rangeFilters, searchFilters, sheetURL, miscOptions) {

  this.currentChartData = {}
  this.sheetURL = sheetURL
  this.miscOptions = {}
  this.filterIDToDataColumn = {}

  // Set up category filters
  var essentialCategoryOptions = ['chartElement','filterElement','chartType','querySelector'];
  var optionalCategoryOptions = {'options':{},'stacked':false,'_stacked':'','multiCategory':false,'queryFilter':null, 'customFunction':null};
  this.categoryFilters = this.initializeFilters(categoryFilters, essentialCategoryOptions, optionalCategoryOptions);
  
  var count = 0
  for (categoryID in this.categoryFilters) {
    this.filterIDToDataColumn[categoryID] = [count];
    count++;
  }

  // Set up rangeFilters
  var essentialRangeOptions = ['defaultTop','defaultBottom','querySelector'];
  var optionalRangeOptions = {'valueTop':rangeFilters['defaultTop'],'valueBottom':rangeFilters['defaultBottom']};
  this.rangeFilters = this.initializeFilters(rangeFilters, essentialRangeOptions, optionalRangeOptions);

  // Set up searchFilters
  var essentialSearchOptions = ['querySelector']
  this.searchFilters = this.initializeFilters(searchFilters, essentialSearchOptions, {});

  // Set up miscellaneous Options
  if ('superToSubCategory' in miscOptions) {
    this.miscOptions.superToSubCategory = miscOptions['superToSubCategory']
  } else {
    this.miscOptions.superToSubCategory = {};
  }
  if ('subToSuperCategory' in miscOptions) {
    this.miscOptions.subToSuperCategory = miscOptions['subToSuperCategory']
  } else {
    this.miscOptions.subToSuperCategory = {};
  }

  var queryList = [];
  for (categoryID in this.categoryFilters) {
    queryList.push(this.categoryFilters[categoryID].querySelector);
  }
  for (searchID in this.searchFilters) {
    queryList.push(this.searchFilters[searchID].querySelector);
  }
  for (rangeID in this.rangeFilters) {
    queryList.push(this.rangeFilters[rangeID].querySelector);
  }

  if ('extraColumns' in miscOptions) {
    for (var i = 0; i < miscOptions.extraColumns.length; i++) {
      queryList.push(miscOptions.extraColumns[i]);
    }
  }

  this.query = "SELECT " + queryList.join(", ");
  
  if ('updateFunction' in miscOptions) {
    this.miscOptions.updateFunction = miscOptions.updateFunction;
  }

  if ('createFilterButton' in miscOptions) {
    this.createFilterButton = miscOptions.createFilterButton;
  } else {
    throw("Must include function to create remove filter buttons! (miscOptions.createFilterButton)" );
    return;
  }

}

GoogleChartDashboard.prototype.initializeFilters = function(filterOptions, essentialOptions, optionalOptions) {
  returnObject = {}
  for (filterID in filterOptions) {
    returnObject[filterID] = {};
    // Add all essential category options
    for (var i = 0; i < essentialOptions.length; i++) {
      var key = essentialOptions[i];
      var value = filterOptions[filterID][key];
      if (value != undefined) {
        returnObject[filterID][key] = value;
      } else {
        throw("Must include " + key + " and a non emtpy value in the category filter options!" );
        return;
      }
    }
    // Add all optional category options or default values if not specified
    for (key in optionalOptions) {
      var value = filterOptions[filterID][key];
      if (value != undefined) {
        returnObject[filterID][key] = value;
      } else {
        returnObject[filterID][key] = optionalOptions[key];
      }
    }
  }
  return returnObject;
}

GoogleChartDashboard.prototype.compareSecondColumn = function(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

GoogleChartDashboard.prototype.expandDataTable = function(groupedData) {
  var keyMap = {};
  for (var i = 0; i < groupedData.getNumberOfRows(); i++) {
    // Sort unlabeled column values under miscellaneous
    var value = groupedData.getValue(i,0);
    if (! value) {
      if ("Misc." in keyMap) {
        keyMap["Misc."]++;
      } else {
        keyMap["Misc."] = 1;
      }
    } else {
    // Expand multiple category columns (e.g. A | B | C) and add them to the hash
      var values = groupedData.getValue(i,0).split(" | ");
      var count = groupedData.getValue(i,1)
      for (j = 0; j < values.length; j++) {
        if (values[j] in keyMap) {
          keyMap[values[j]]+= count;
        } else {
          keyMap[values[j]] = count;
        }
      }
    }
  }
  return keyMap;
}

GoogleChartDashboard.prototype.aggregateToSuperFilters = function(queryID, keyMap) {

  var aggregatedkeyMap = {};
  for (key in keyMap) {
    if (key == "Misc.") {
      aggregatedkeyMap["Misc."] = keyMap["Misc."];
    } else {
      var group = this.miscOptions.subToSuperCategory[queryID][key];
      if (!group) {
        console.log("Could not find " + key + " in " + queryID);
        continue;
      }
      if (group in aggregatedkeyMap) {
        aggregatedkeyMap[group] += keyMap[key];
      } else {
        aggregatedkeyMap[group] = keyMap[key];
      }
    }
  }
  return aggregatedkeyMap;
}

GoogleChartDashboard.prototype.narrowToSuperFilter = function(queryID, keyMap) {
  var filteredkeyMap = {};
  for (key in keyMap) {
    var group = this.miscOptions.subToSuperCategory[queryID][key];
    if (!group) {
      console.log("Could not find " + key + " in " + queryID);
      continue;
    }
    // Check that the super filter matches set super filter
    if (group == this.categoryFilters[queryID]._stackedValue) {
      if (key in filteredkeyMap) {
        filteredkeyMap[key] += keyMap[key];
      } else {
        filteredkeyMap[key] = keyMap[key];
      }
    }
  }
  return filteredkeyMap;
}

// Return the event handler from this wrapper function, passing the variables for the chart in order to "fix" as arguments
GoogleChartDashboard.prototype.selectHandlerFactory = function(chartObject, chartData, filterID, obj) {

  return function() {
    var selectedItem = chartObject.getSelection()[0];
    if (selectedItem) {
      var val = chartData.getValue(selectedItem.row, 0);
      console.log('The user selected ' + val + ' and searching in ' + filterID);
      if (obj.categoryFilters[filterID].stacked && !obj.categoryFilters[filterID]._stackedValue && val in obj.miscOptions.superToSubCategory[filterID]) {
        obj.categoryFilters[filterID]._stackedValue = val;
        obj.categoryFilters[filterID].queryFilter = null;
      } else {
        obj.categoryFilters[filterID].queryFilter = val;
      }
      obj.updateAll();
      document.getElementById(obj.categoryFilters[filterID].filterElement).style.display = '';
      document.getElementById(obj.categoryFilters[filterID].filterElement).children[0].innerHTML = '<span class="glyphicon glyphicon-remove" style="margin:5px;"></span>' + val;
    }
  }
}

GoogleChartDashboard.prototype.drawChart = function(filterID, chartData) {

  // store current charts for the filter
  this.currentChartData[filterID] = chartData;

  if (this.categoryFilters[filterID].chartType == 'pie') {
    var newChart = new google.visualization.PieChart(document.getElementById(this.categoryFilters[filterID].chartElement));
  } else if (this.categoryFilters[filterID].chartType =='geo') {
    var newChart = new google.visualization.GeoChart(document.getElementById(this.categoryFilters[filterID].chartElement));
  } else if (this.categoryFilters[filterID].chartType =='column') {
    var newChart = new google.visualization.ColumnChart(document.getElementById(this.categoryFilters[filterID].chartElement));
  } else if (this.categoryFilters[filterID].chartType == 'custom') {
    this.categoryFilters[filterID].customFunction(chartData);
    return;
  }

  var obj = this;

  newChart.draw(chartData, this.categoryFilters[filterID].options);
  google.visualization.events.addListener(newChart, 'select', this.selectHandlerFactory(newChart, chartData, filterID, obj)); 
}

GoogleChartDashboard.prototype.redrawChart = function(filterID) {
  this.drawChart(filterID, this.currentChartData[filterID]);
}

GoogleChartDashboard.prototype.hasSuperFilter = function(filterID) {
  return (this.categoryFilters[filterID].stacked && this.categoryFilters[filterID]._stackedValue && this.categoryFilters[filterID]._stackedValue in this.miscOptions.superToSubCategory[filterID] );
}

GoogleChartDashboard.prototype.updateCharts = function(data) {

  if (this.miscOptions.updateFunction) {
    this.miscOptions.updateFunction(data);
  }
  // drawDataTable(data);

  if (data.getNumberOfRows() < 4) {
    alert("Too few data points (<4) to visualize charts. See data table below for the full listing.");
    return;
  }

  for (categoryID in this.categoryFilters) {

    // If a filter is already set, exclude other categories in multi-categories
    if ( this.categoryFilters[categoryID].queryFilter) {
      var chartData = new google.visualization.DataTable();
      chartData.addColumn('string', categoryID);
      chartData.addColumn('number', 'count');
      chartData.addRow([this.categoryFilters[categoryID].queryFilter, data.getNumberOfRows()]);
      this.drawChart(categoryID, chartData);
      continue;
    }

    // Group all data by their nominal category
    var groupedData = google.visualization.data.group(data, this.filterIDToDataColumn[categoryID], [{
      column: 0,
      aggregation: google.visualization.data.count,
      type: 'number'
    }]);

    // Split up multi-category rows in to their respective row categories
    if (this.categoryFilters[categoryID].multiCategory) {

      var keyMap = this.expandDataTable(groupedData);

      // No category set yet, aggregate to super filters
      if (this.categoryFilters[categoryID].stacked && !this.categoryFilters[categoryID]._stackedValue && !this.categoryFilters[categoryID].queryFilter) {
        keyMap = this.aggregateToSuperFilters(categoryID, keyMap);
      } else if (this.categoryFilters[categoryID].stacked && this.categoryFilters[categoryID]._stackedValue && !this.categoryFilters[categoryID].queryFilter){
      // If there is a super category set but no specific query filter, restrict results to those in superset
        keyMap = this.narrowToSuperFilter(categoryID, keyMap);
      }

      // Create data table from hash
      var chartData = new google.visualization.DataTable();

      chartData.addColumn('string', categoryID);
      chartData.addColumn('number', 'count');

      var dataRows = [];
      for (var key in keyMap) {
        dataRows.push([key, keyMap[key]]);
      }
      dataRows.sort(this.compareSecondColumn);

      chartData.addRows(dataRows);

      this.drawChart(categoryID, chartData);

    } else {
      // Single category - grouped data is fine as is
      this.drawChart(categoryID, groupedData);

    }

  }

}

GoogleChartDashboard.prototype.filterJunction = function(filters) {
  if (filters) {
    return " AND ";
  } else {
    return " WHERE ";
  }
}

// Update the data table and all corresponding charts
GoogleChartDashboard.prototype.updateAll = function() {

  var filters = "";

  for (categoryID in this.categoryFilters) {
    if (this.categoryFilters[categoryID].queryFilter) {
      filters += this.filterJunction(filters)
      if (this.categoryFilters[categoryID].multiCategory) {
          filters += this.categoryFilters[categoryID].querySelector + " LIKE '%" + this.categoryFilters[categoryID].queryFilter + "%'";
      } else {
        filters += this.categoryFilters[categoryID].querySelector + " = '" + this.categoryFilters[categoryID].queryFilter + "'";
      }
    } else if (this.categoryFilters[categoryID]._stackedValue) {
        filters += this.filterJunction(filters)
        var filterList = "";
        for (key in this.miscOptions.superToSubCategory[categoryID][this.categoryFilters[categoryID]._stackedValue]) {
          if (filterList) {
            filterList += " OR ";
          }
          filterList += this.categoryFilters[categoryID].querySelector + " LIKE '%" + this.miscOptions.superToSubCategory[categoryID][this.categoryFilters[categoryID]._stackedValue][key] + "%'";
        }
        filters += "(" + filterList + ")";
    }
  }

  for (searchID in this.searchFilters) {
    if (this.searchFilters[searchID].searchQuery) {
      filters += this.filterJunction(filters)
      filters +=  "LOWER(H) LIKE LOWER('%" + this.searchFilters[searchID].searchQuery + "%')";
    }
  }

  for (rangeID in this.rangeFilters) {
    if (this.rangeFilters[rangeID].valueTop != this.rangeFilters[rangeID].defaultTop || this.rangeFilters[rangeID].valueBottom != this.rangeFilters[rangeID].defaultBottom) {
      filters += this.filterJunction(filters)
      filters += "( G >= " + this.rangeFilters[rangeID].valueBottom + " AND " + this.rangeFilters[rangeID].querySelector + " <= " + this.rangeFilters[rangeID].valueTop + ")" 
    }
  }

  console.log(this.query + filters);
  var queryText = encodeURIComponent(this.query + filters);

  var gvizQuery = new google.visualization.Query(this.sheetURL + queryText);

  // Retrieve query response from Google Fusion Tables
  var obj = this;
  gvizQuery.send(this.queryHandlerFactory(obj));
}

GoogleChartDashboard.prototype.queryHandlerFactory = function(response) {
  var obj = this;
  return function(response) {
    if (response.isError()) {
      alert('Error in query: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
    }
    // Update all charts with the new data table
    obj.updateCharts(response.getDataTable());
  }
}

GoogleChartDashboard.prototype.removeFilter = function(filterID) {
  if (! this.categoryFilters[filterID].queryFilter && this.categoryFilters[filterID].stacked && this.categoryFilters[filterID]._stackedValue) {
    this.categoryFilters[filterID]._stackedValue = '';
  }
  // regular filter must be removed
  this.categoryFilters[filterID].queryFilter = null;
  this.updateAll();

  if (this.categoryFilters[filterID].stacked && this.categoryFilters[filterID]._stackedValue) {
    document.getElementById(this.categoryFilters[filterID].filterElement).style.display = '';
    document.getElementById(this.categoryFilters[filterID].filterElement).children[0].innerHTML = this.createFilterButton(filterID);
  } else {
    document.getElementById(this.categoryFilters[filterID].filterElement).style.display = 'none';
    document.getElementById(this.categoryFilters[filterID].filterElement).children[0].innerHTML = "";
  }
}

