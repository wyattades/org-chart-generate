const embedOrgChart = require('./orgchart');

const $ = window.jQuery;
$(() => {  
  const userdata = document.getElementById('orgchart-userdata');
  const container = document.getElementById('orgchart-container');

  if (userdata && container) {
    const arrayData = Array.prototype.map.call(userdata.children, el => {
      const $el = $(el);
      const $user = $el.find('.paragraph-sections > .field--name-field-person article.profile').first();
      const Link = $user.attr('about');
      
      return {
        EmployeeID: Link,
        ManagerID: $el.find('.paragraph-sections > .field--name-field-manager article.profile')
            .first().attr('about'),
        OtherManagerID: $el.find('.paragraph-sections > .field--name-field-dotted-line-manager article.profile')
            .first().attr('about'),
        OtherInfo: $el.find('.paragraph-sections > .field--name-field-extra-information').first().text(),        
        Name: $user.find('.field--name-field-name .field__item').first().text(),
        Role: $user.find('.field--name-field-role .field__item').first().text(),
        ImageURL: $user.find('.field--name-user-picture img').first().attr('src'),
        Link,
      };
    });

    embedOrgChart(arrayData, container);
  }
});
