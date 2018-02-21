const dragscroll = require('dragscroll');

if (!google || !google.charts)
  throw new Error('Must include google script loader: https://www.gstatic.com/charts/loader.js')

google.charts.load('current', { packages: ['orgchart'] });

// Helper functions:

const formatData = ({ FirstName, LastName, Role, Phone, Email, ImageURL }) => {
  return `\
<p><strong>${FirstName} ${LastName}</strong></p>\
<p><em>${Role}</em></p>`;
};

const formatLegend = ({ FirstName, LastName, Role, Phone, Email, ImageURL }) => {
  const name = `${FirstName} ${LastName}`;
  return `\
<img src="${ImageURL}" alt="${name}">
<div>
<p><strong>${name}</strong></p>\
<p><em>${Role}</em></p>
</div>`;
};

// embedOrgChart
module.exports = (arrayData, elementId) => {

  // Local variables:

  let selected = null;
  let hovered = null;

  const parent = document.getElementById(elementId);
  if (!parent)   {
    console.error(`OrgChart: no element with id '${elementId}'`);
    return;
  }

  // Wait google charts callback, then create chart with data

  new Promise(resolve => google.charts.setOnLoadCallback(() => resolve()))
  .then((arrayData) => {

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
    console.log(data);

    // Remove any existing children
    while (parent.firstChild) myNode.removeChild(parent.firstChild);
    parent.style.position = 'relative';

    const el = document.createElement('div');
    el.classList.add('dragscroll', 'orgchart');
    parent.appendChild(el);

    const legend = document.createElement('div');
    legend.classList.add('orgchart-legend', 'disabled');
    // legend.appendChild(document.createElement('img'));
    // legend.appendChild(document.createElement('p'));
    parent.appendChild(legend);

    const setLegend = (newSelected, newHovered) => {
      if (newSelected !== false) selected = newSelected;
      console.log(newSelected, newHovered);

      const newData = newHovered || selected;
      if (newData) {
        legend.innerHTML = formatLegend(newData);

        legend.classList.remove('disabled');          
      } else {
        legend.classList.add('disabled');
      }
    };

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
