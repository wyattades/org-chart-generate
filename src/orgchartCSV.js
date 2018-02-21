const Papa = require('papaparse');
const embedOrgChart = require('./orgchart');

const parseCsv = (url) => new Promise((resolve, reject) => {
  Papa.parse(url, {
    download: true,
    skipEmptyLines: true,
    header: true,
    complete: (result) => {
      if (result.data.length === 0 ||
          result.data[0].length === 0 ||
          result.errors.length > 0) {
        reject('OrgChart: failed to parse data:', result.error[0]);
      } else {
        resolve(result.data);
      }
    },
    error: () => reject('OrgChart: failed to load data'),
  });
});

module.exports = (url, elementId) => {
  parseCsv(url)
  .then(arrayData => embedOrgChart(arrayData, elementId))
  .catch(console.error);
};