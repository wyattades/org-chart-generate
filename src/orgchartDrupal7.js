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
        const label = $item.prev('label').text();
        if (label && label.length > 0) {
          if (label.startsWith(/Full\s+Name/i)) res.Name = $item.find('li').first().text().trim();
          else if (label.startsWith(/Title/i)) res.Role = $item.find('li').first().text().trim();
          else if (label.startsWith(/Primary\s+E.?Mail\s+Address/i)) res.Email = $item.find('li').first().text().trim();
        }
      });

      return res;
    });
    console.log(arrayData);
    embedOrgChart(arrayData, container);
  }
});
