const embedOrgChart = require('./orgchart');

const $ = window.jQuery;

$(() => {  
  const userdata = document.getElementById('orgchart-userdata');
  const container = document.getElementById('orgchart-container');

  if (userdata && container) {
    
    const arrayData = $(userdata).children().toArray().map(el => {
      const $el = $(el);
      const EmployeeID = $el.find('.orgchart-username').first().text();
      const res = {
        EmployeeID,
        ManagerID: $el.find('.field-name-field-manager .field-item').first().text(),        
        Role: $el.find('.field-name-field-role .field-item').first().text(),
        ImageURL: $el.find('.field-name-field-image .field-item img').first().attr('src'),
        Link: `/user/${EmployeeID}`,
      };

      const $items = $el.find('.form-item.form-type-item > .item-list');
      $items.each((i, item) => {
        const $item = $(item);
        const setLabelVal = (key) => { res[key] = $item.find('li').first().text().trim(); };
        const label = $item.prev('label').text();
        if (label && label.length > 0) {
          if (/Full\s+Name/i.test(label)) setLabelVal('Name');
          else if (/Title/i.test(label)) setLabelVal('Role');
          else if (/Primary\s+E.?Mail\s+Address/i.test(label)) setLabelVal('Email');
        }
      });

      return res;
    });

    embedOrgChart(arrayData, container);
  }
});
