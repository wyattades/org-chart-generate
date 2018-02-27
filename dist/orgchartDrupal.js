"use strict";function _objectWithoutProperties(e,r){var t={};for(var o in e)r.indexOf(o)>=0||Object.prototype.hasOwnProperty.call(e,o)&&(t[o]=e[o]);return t}function _toConsumableArray(e){if(Array.isArray(e)){for(var r=0,t=Array(e.length);r<e.length;r++)t[r]=e[r];return t}return Array.from(e)}!function(){return function e(r,t,o){function n(i,l){if(!t[i]){if(!r[i]){var c="function"==typeof require&&require;if(!l&&c)return c(i,!0);if(a)return a(i,!0);var s=new Error("Cannot find module '"+i+"'");throw s.code="MODULE_NOT_FOUND",s}var d=t[i]={exports:{}};r[i][0].call(d.exports,function(e){var t=r[i][1][e];return n(t||e)},d,d.exports,e,r,t,o)}return t[i].exports}for(var a="function"==typeof require&&require,i=0;i<o.length;i++)n(o[i]);return n}}()({1:[function(e,r,t){var o,n;o=this,n=function(e){var r,t,o=window,n=document,a="mousemove",i="mouseup",l="mousedown",c="EventListener",s="add"+c,d="remove"+c,u=[],f=function(e,c){for(e=0;e<u.length;)(c=(c=u[e++]).container||c)[d](l,c.md,0),o[d](i,c.mu,0),o[d](a,c.mm,0);for(u=[].slice.call(n.getElementsByClassName("dragscroll")),e=0;e<u.length;)!function(e,c,d,u,f,m){(m=e.container||e)[s](l,m.md=function(r){e.hasAttribute("nochilddrag")&&n.elementFromPoint(r.pageX,r.pageY)!=m||(u=1,c=r.clientX,d=r.clientY,r.preventDefault())},0),o[s](i,m.mu=function(){u=0},0),o[s](a,m.mm=function(o){u&&((f=e.scroller||e).scrollLeft-=r=-c+(c=o.clientX),f.scrollTop-=t=-d+(d=o.clientY),e==n.body&&((f=n.documentElement).scrollLeft-=r,f.scrollTop-=t))},0)}(u[e++])};"complete"==n.readyState?f():o[s]("load",f,0),e.reset=f},"function"==typeof define&&define.amd?define(["exports"],n):n(void 0!==t?t:o.dragscroll={})},{}],2:[function(e,r,t){var o=e("dragscroll");if(!window.google||!window.google.charts)throw new Error("Must include google script loader: https://www.gstatic.com/charts/loader.js");google.charts.load("current",{packages:["orgchart"]});r.exports=function(e,r){var t=null,n=document.getElementById(r);if(n){for(;n.firstChild;)myNode.removeChild(n.firstChild);n.style.position="relative";var a=document.createElement("div");a.classList.add("dragscroll","orgchart"),n.appendChild(a);var i=document.createElement("div");i.classList.add("orgchart-legend","disabled"),n.appendChild(i);var l=function(e,r){!1!==e&&(t=e);var o,n,a,l,c,s=r||t;s?(i.innerHTML=(n=(o=s).Name,a=o.Role,o.Phone,o.Email,l=o.ImageURL,c=o.Link,(l?'<img src="'+l+'" alt="'+n+'">':"")+"<div><p><strong>"+n+"</strong></p><p><em>"+a+"</em></p>"+(c?'<a href="'+c+'" title="'+n+' Account Page"></a>':"")+"</div>"),i.classList.remove("disabled")):i.classList.add("disabled")};if(!e||0===e.length)return a.classList.add("invalid-data-provided"),void console.error("Orgchart Error: undefined or empty user data provided");var c={},s=!0,d=!1,u=void 0;try{for(var f,m=e[Symbol.iterator]();!(s=(f=m.next()).done);s=!0){c[f.value.EmployeeID]=!0}}catch(e){d=!0,u=e}finally{try{!s&&m.return&&m.return()}finally{if(d)throw u}}var g=!0,v=!1,p=void 0;try{for(var h,y=e[Symbol.iterator]();!(g=(h=y.next()).done);g=!0){var w=h.value,b=w.ManagerID;!b||b in c||(console.error("Orgchart Error: employee '"+w.EmployeeID+"' has undefined manager '"+b+"'"),delete w.ManagerID)}}catch(e){v=!0,p=e}finally{try{!g&&y.return&&y.return()}finally{if(v)throw p}}new Promise(function(e){return google.charts.setOnLoadCallback(function(){return e()})}).then(function(){var r=new google.visualization.arrayToDataTable([[{label:"EmployeeID",type:"string"},{label:"ManagerID",type:"string"},{label:"ToolTip",type:"string"}]].concat(_toConsumableArray(e.map(function(e){var r=e.EmployeeID,t=e.ManagerID;return[{v:r,f:function(e){var r=e.Name,t=e.Role;e.Phone,e.Email,e.ImageURL;return"<p><strong>"+(r||"<name>")+"</strong></p><p><em>"+t+"</em></p>"}(_objectWithoutProperties(e,["EmployeeID","ManagerID"]))},t,"Double click to collapse"]})))),t=new google.visualization.OrgChart(a);google.visualization.events.addListener(t,"select",function(){var r=t.getSelection()[0];l(r?e[r.row]:null,!1)}),google.visualization.events.addListener(t,"onmouseover",function(r){var t=r.row;l(!1,e[t])}),google.visualization.events.addListener(t,"onmouseout",function(){l(!1,null)}),t.draw(r,{allowHtml:!0,selectedNodeClass:"orgchart-node-selected",nodeClass:"orgchart-node",allowCollapse:!0,size:"large"}),o.reset()}).catch(console.error)}else console.error("OrgChart: no element with id '"+r+"'")}},{dragscroll:1}],3:[function(e,r,t){var o=e("./orgchart"),n=jQuery;n(function(){var e=n('#orgchart-userdata article[typeof="schema:Person"]').toArray().map(function(e){var r=n(e),t=r.attr("about");return{EmployeeID:t,ManagerID:r.find(".field--name-field-manager .field__item a").first().attr("href"),Name:r.find(".field--name-field-name .field__item").first().text(),Role:r.find(".field--name-field-role .field__item").first().text(),ImageURL:r.find(".field--name-user-picture img").first().attr("src"),Link:t}});o(e,"orgchart-container")})},{"./orgchart":2}]},{},[3]);