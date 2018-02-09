google.charts.load('current', { packages: ['orgchart'] });

function embedOrgChart(csvUrl, elementId) {

  // Local variables:

  let selected = null;
  let hovered = null;

  // Helper functions:

  const parseCsv = (url) => new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      skipEmptyLines: true,
      header: true,
      complete: (result) => {
        if (result.data.length === 0 || result.data[0].length === 0 || result.errors.length > 0) {
          reject('OrgChart: failed to parse data:', result.error[0]);
        } else {
          resolve(result.data);
        }
      },
      error: () => reject('OrgChart: failed to load data'),
    });
  });
  
  const formatData = ({ FirstName, LastName, Role, Phone, Email, ImageURL }) => {
    return `\
  <p>${FirstName} ${LastName}</p>\
  <p>${Role}</p>`;
  };

  const parent = document.getElementById(elementId);
  if (!parent)   {
    console.error(`OrgChart: no element with id '${elementId}'`);
    return
  }

  // Onload google charts
  google.charts.setOnLoadCallback(() => {
  
    parseCsv(csvUrl)
    .then((arrayData) => {

      const data = new google.visualization.DataTable({
        cols: [
          { label: 'EmployeeID', type: 'string' },
          { label: 'ManagerID', type: 'string' },
          { label: 'ToolTip', type: 'string' },
        ],
        rows: arrayData.map(({ EmployeeID, ManagerID, ...employeeInfo }) => {
          return { c: [
            { v: EmployeeID, f: formatData(employeeInfo) },
            { v: ManagerID },
            { v: 'Double click to collapse' },
          ] };
        }),
      });

      // Remove any children
      while (parent.firstChild) myNode.removeChild(parent.firstChild);
      parent.style.position = 'relative';

      const el = document.createElement('div');
      el.classList.add('dragscroll', 'orgchart');
      parent.appendChild(el);

      const legend = document.createElement('div');
      legend.classList.add('orgchart-legend', 'disabled');
      legend.appendChild(document.createElement('img'));
      legend.appendChild(document.createElement('p'));
      parent.appendChild(legend);

      const setLegend = (newSelected, newHovered) => {
        if (newSelected !== false) selected = newSelected;

        const newData = newHovered || selected;
        if (newData) {
          console.log(newData);
          legend.children[0].setAttribute('src', newData.ImageURL);
          legend.children[1].textContent = `${newData.FirstName} ${newData.LastName}`;
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
  });
};
