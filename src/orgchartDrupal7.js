const embedOrgChart = require('./orgchart');

const $ = window.jQuery;

$(() => {  
  const userdata = document.querySelector('.node-organization-chart #orgchart-userdata');
  const container = document.querySelector('.node-organization-chart #orgchart-container');

  if (userdata && container) {
    
    const arrayData = [];
    
    $(userdata).children().each((i, el) => {
      const $el = $(el);
      const EmployeeID = $el.find('.orgchart-uid').first().text().trim();
      if (!EmployeeID) return; // continue

      const $profile = $el.find('.profile').first();

      const res = {
        EmployeeID,
        ManagerID: $el.find('.field-name-field-organization-chart-manager .field-item').first().text().trim(),
        OtherInfo: $el.find('.field-name-field-extra-information .field-item').first().text(),
        Role: $profile.find('.field-name-field-role .field-item').first().text(),
        ImageURL: $profile.find('.field-name-field-image .field-item img').first().attr('src'),
        Link: `/user/${EmployeeID}`,
      };

      const $items = $profile.find('.form-item.form-type-item > .item-list');
      $items.each((i2, item) => {
        const $item = $(item);
        const setLabelVal = (key) => { res[key] = $item.find('li').first().text().trim(); };
        const label = $item.prev('label').text();
        if (label && label.length > 0) {
          if (/Full\s+Name/i.test(label)) setLabelVal('Name');
          else if (/Title/i.test(label)) setLabelVal('Role');
          else if (/Primary\s+E.?Mail\s+Address/i.test(label)) setLabelVal('Email');
        }
      });

      arrayData.push(res);
    });

    embedOrgChart(arrayData, container);
  }
});
