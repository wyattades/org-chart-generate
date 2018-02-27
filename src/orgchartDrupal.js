const embedOrgChart = require('./orgchart');

var $ = jQuery;
$(() => {  
  const arrayData = $('#orgchart-userdata article[typeof="schema:Person"]').toArray().map(el => {
    const $el = $(el);
    const Link = $el.attr('about');
    return {
      EmployeeID: Link,
      ManagerID: $el.find('.field--name-field-manager .field__item a').first().attr('href'),
      Name: $el.find('.field--name-field-name .field__item').first().text(),
      Role: $el.find('.field--name-field-role .field__item').first().text(),
      ImageURL: $el.find('.field--name-user-picture img').first().attr('src'),
      Link,
    };
  });

  embedOrgChart(arrayData, 'orgchart-container');
});
