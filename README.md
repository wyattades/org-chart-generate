# org-chart-module

Generate beautiful and intuitive Org Charts for your webpage.

[Live Demo](https://wyattades.github.io/org-chart-module/)



## Usage

1. Load this script: https://www.gstatic.com/charts/loader.js
2. Load this stylesheet: https://cdn.jsdelivr.net/gh/wyattades/org-chart-module/dist/orgchart.css

org-chart-module supports 2 modes for passing orgchart data:  
- **Passing a CSV file url**
  1. Add the following script: https://cdn.jsdelivr.net/gh/wyattades/org-chart-module/dist/orgchartCSV.js
  2. After the document loads, call `embedOrgChart(<csv-file-url>, <element-OR-element-id>)` to embed the org chart
- **Passing a raw data array**
  1. Add the following script: https://cdn.jsdelivr.net/gh/wyattades/org-chart-module/dist/orgchart.js
  2. After the document loads, call `embedOrgChart(<data-array>, <element-OR-element-id>)` to embed the org chart

Format your data array or CSV like [this](https://github.com/wyattades/org-chart-module/blob/gh-pages/example_data.csv)

*Note: orgchartDrupal7.js and orgchartDrupal8.js are compatible with Drupal 7/8 websites*
