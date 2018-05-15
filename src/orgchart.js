/* global google */

if (!window.google || !window.google.charts)
  throw new Error('Orgchart: Must include google charts script loader: ' + 
    'https://www.gstatic.com/charts/loader.js');

google.charts.load('current', { packages: ['orgchart'] });

// Helper functions:

const formatData = ({ EmployeeID, Name, Role = '' }) => {
  return `<p id="${EmployeeID}-eid"><strong>${Name || EmployeeID}</strong></p>\
<p><em>${Role}</em></p>`;
};

const formatLegend = ({ EmployeeID, Name, Role, Email, ImageURL, Link, OtherInfo }) => {
  return `${ImageURL ? `<div class="orgchart-legend-img"><img src="${ImageURL}" alt="${Name}"></div>` : ''}\
<div>\
<p><strong>${Name || EmployeeID}</strong></p>\
${Role ? `<p class="orgchart-legend-role"><em>${Role}</em></p>` : ''}\
${OtherInfo ? `<p class="orgchart-legend-otherinfo">${OtherInfo}</p>` : ''}\
${Email ? `<p class="orgchart-legend-email"><a href="mailto:${Email}">${Email}</a></p>` : ''}\
${Link ? `<a class="orgchart-legend-link" href="${Link}" title="${Name} Account Page"></a>` : ''}\
</div>`;
};

const getElement = (el) => {
  if (typeof el === 'string') return document.getElementById(el);
  else if (typeof HTMLElement === 'object' ? el instanceof HTMLElement :
      (el && typeof el === 'object' && el !== null && 
      el.nodeType === 1 && typeof el.nodeName === 'string')) return el;
  else return null;
};

// e1 is Employee and e2 is OtherManager
const drawLine = (container, scale, e1, e2) => {
  const points = [];
  const addPoint = (x, y) => points.push(`${x},${y}`);

  const margin = 14 * scale;
  const offset = 10 * scale;

  const lesser = e1.x < e2.x;

  const x1 = e1.x + e1.w / 2 + offset * (lesser ? 1 : -1),
        x2 = e2.x + e2.w / 2 + offset * (lesser ? -1 : 1);

  const midX = lesser ? e1.w + margin : -margin;
  addPoint(x1, e1.y);

  addPoint(x1, e1.y - margin);
  addPoint(e1.x + midX, e1.y - margin);
  addPoint(e1.x + midX, e2.y + e2.h + margin);
  addPoint(x2, e2.y + e2.h + margin);
  addPoint(x2, e2.y + e2.h);

  const addShape = (type, attributes) => {
    const shape = document.createElementNS('http://www.w3.org/2000/svg', type);
    for (const key in attributes) {
      shape.setAttribute(key, attributes[key]);      
    }
    container.appendChild(shape);
  };

  // addShape('rect', { x: e1.x, y: e1.y, width: e1.w, height: e1.h, stroke: 'red' });
  // addShape('rect', { x: e2.x, y: e2.y, width: e2.w, height: e2.h, stroke: 'blue' });
  
  addShape('polyline', { points: points.join(' ') });
};

// embedOrgChart
module.exports = (arrayData, element) => {

  // Local variables:
  let selected = null;

  // Verify given element
  const parent = getElement(element);
  if (!parent) {
    console.error('OrgChart: invalid element or id provided');
    return;
  }

  // Remove any existing children
  while (parent.firstChild) parent.removeChild(parent.firstChild);
  parent.style.position = 'relative';
  parent.style.height = '700px';

  const container = document.createElement('div');
  container.classList.add('orgchart');
  parent.appendChild(container);

  const legend = document.createElement('div');
  legend.classList.add('orgchart-legend', 'disabled');
  parent.appendChild(legend);

  const otherManagers = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  otherManagers.id = 'other-managers';
  parent.appendChild(otherManagers);

  // Perform validity checks on the given data

  if (!arrayData || arrayData.length === 0) {
    container.classList.add('invalid-data-provided');
    console.error('Orgchart Error: undefined or empty user data provided');
    return;
  }

  const persons = {};
  for (const rowData of arrayData) persons[rowData.EmployeeID] = true;
  for (const rowData of arrayData) {
    const { EmployeeID, ManagerID, OtherManagerID } = rowData;
    if (ManagerID && !(ManagerID in persons)) {
      console.error(`Orgchart Error: employee '${EmployeeID}' \
          has undefined manager '${ManagerID}'`);
      delete rowData.ManagerID;
    }
    if (OtherManagerID && !(OtherManagerID in persons)) {
      console.error(`Orgchart Error: employee '${EmployeeID}' \
          has undefined other-manager '${OtherManagerID}'`);
      delete rowData.OtherManagerID;
    }
  }

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

  // Wait google charts callback, then create chart with data

  new Promise(resolve => google.charts.setOnLoadCallback(() => resolve()))
  .then(() => {

    const data = new google.visualization.arrayToDataTable([
      [
        { label: 'EmployeeID', type: 'string' },
        { label: 'ManagerID', type: 'string' },
        { label: 'ToolTip', type: 'string' },
      ],
      ...arrayData.map((employeeInfo) => {
        return [
          { v: employeeInfo.EmployeeID, f: formatData(employeeInfo) },
          employeeInfo.ManagerID,
          'Double click to collapse',
        ];
      }),
    ]);

    const chart = new google.visualization.OrgChart(container);

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

    // Resize chart to fit parent, and center it in parent
    const scaleToFit = () => {
      const chartEl = container.children[0];
      chartEl.style.transformOrigin = 'top left';
      
      // Scale orgchart to fit in container
      const scale = Math.min(container.clientWidth / chartEl.clientWidth,
          container.clientHeight / chartEl.clientHeight);
      if (scale < 1) {
        chartEl.style.transform = `scale(${scale})`;
      }

      // Center orgchart horizontally
      const marginLeft = container.offsetWidth / 2 - (chartEl.offsetWidth * (scale < 1 ? scale : 1) / 2);
      if (marginLeft >= 0) chartEl.style.marginLeft = `${marginLeft}px`;

      // Clear SVG of previous dotted lines
      while(otherManagers.firstChild) otherManagers.removeChild(otherManagers.firstChild);

      // Get all node element bounds
      const b = otherManagers.getBoundingClientRect();      
      const $nodes = document.getElementsByClassName('orgchart-node');
      const nodes = Array.prototype.reduce.call($nodes, (obj, node) => {
        const id = node.firstChild && node.firstChild.id && node.firstChild.id.replace('-eid', '');
        if (id) {
          const e = node.getBoundingClientRect();
          obj[id] = { x: e.left - b.left, y: e.top - b.top, w: e.width, h: e.height };
        }
        return obj;
      }, {});

      for (const { EmployeeID, OtherManagerID } of arrayData) {
        if (OtherManagerID) {
          const e1 = nodes[EmployeeID],
                e2 = nodes[OtherManagerID];
          if (e1 && e2) {
            drawLine(otherManagers, scale, e1, e2);
          }
        }
      }
    };

    window.addEventListener('resize', scaleToFit);
    google.visualization.events.addListener(chart, 'collapse', scaleToFit);
    google.visualization.events.addListener(chart, 'ready', scaleToFit);

    // Draw charts
    chart.draw(data, {
      allowHtml: true,
      selectedNodeClass: 'orgchart-node-selected',
      nodeClass: 'orgchart-node',
      allowCollapse: true,
      size: 'large',
    });

  })
  .catch(console.error);
};
