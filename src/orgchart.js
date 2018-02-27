const dragscroll = require('dragscroll');

if (!window.google || !window.google.charts)
  throw new Error('Must include google script loader: https://www.gstatic.com/charts/loader.js');

google.charts.load('current', { packages: ['orgchart'] });

// Helper functions:

const formatData = ({ Name, Role, Phone, Email, ImageURL }) => {
  return `\
<p><strong>${Name || '<name>'}</strong></p>\
<p><em>${Role}</em></p>`;
};

const formatLegend = ({ Name, Role, Phone, Email, ImageURL, Link }) => {
  return (ImageURL ? `<img src="${ImageURL}" alt="${Name}">` : '') +
`<div>\
<p><strong>${Name}</strong></p>\
<p><em>${Role}</em></p>\
${Link ? `<a href="${Link}" title="${Name} Account Page"></a>` : ''}\
</div>`;
};

// embedOrgChart
module.exports = (arrayData, elementId) => {

  // Local variables:

  let selected = null;
  let hovered = null;

  const parent = document.getElementById(elementId);
  if (!parent) {
    console.error(`OrgChart: no element with id '${elementId}'`);
    return;
  }

  // Remove any existing children
  while (parent.firstChild) myNode.removeChild(parent.firstChild);
  parent.style.position = 'relative';

  const el = document.createElement('div');
  el.classList.add('dragscroll', 'orgchart');
  parent.appendChild(el);

  const legend = document.createElement('div');
  legend.classList.add('orgchart-legend', 'disabled');
  parent.appendChild(legend);

  const setLegend = (newSelected, newHovered) => {
    if (newSelected !== false) selected = newSelected;

    const newData = newHovered || selected;
    if (newData) {
      legend.innerHTML = formatLegend(newData);

      legend.classList.remove('disabled');          
    } else {
      legend.classList.add('disabled');
    }
  };

  if (!arrayData || arrayData.length === 0) {
    el.classList.add('invalid-data-provided');
    console.error('Orgchart Error: undefined or empty user data provided');
    return;
  }

  const persons = {};
  for (const rowData of arrayData) persons[rowData.EmployeeID] = true;
  for (const rowData of arrayData) {
    const manager = rowData.ManagerID;
    if (manager && !(manager in persons)) {
      console.error(`Orgchart Error: employee '${rowData.EmployeeID}' has undefined manager '${manager}'`);
      delete rowData.ManagerID;
    }
  }

  // Wait google charts callback, then create chart with data

  new Promise(resolve => google.charts.setOnLoadCallback(() => resolve()))
  .then(() => {

    const data = new google.visualization.arrayToDataTable([
      [
        { label: 'EmployeeID', type: 'string' },
        { label: 'ManagerID', type: 'string' },
        { label: 'ToolTip', type: 'string' },
      ],
      ...arrayData.map(({ EmployeeID, ManagerID, ...employeeInfo }) => {
        return [
          { v: EmployeeID, f: formatData(employeeInfo) },
          ManagerID,
          'Double click to collapse',
        ];
      }),
    ]);

    const chart = new google.visualization.OrgChart(el);

    // Handle selection and mouse hover
    google.visualization.events.addListener(chart, 'select', () => {
      const rowcol = chart.getSelection()[0];

      if (rowcol) setLegend(arrayData[rowcol.row], false);
      else setLegend(null, false);
    });
    google.visualization.events.addListener(chart, 'onmouseover', ({ row }) => {
      setLegend(false, arrayData[row]);
    });
    google.visualization.events.addListener(chart, 'onmouseout', () => {
      setLegend(false, null);
    });

    chart.draw(data, {
      allowHtml: true,
      selectedNodeClass: 'orgchart-node-selected',
      nodeClass: 'orgchart-node',
      allowCollapse: true,
      size: 'large',
    });

    dragscroll.reset();
  })
  .catch(console.error);
};
