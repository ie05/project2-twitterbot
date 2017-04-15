var moment = require('moment');

function dateFormat(date) {
  m = moment.utc(date);
  return m.parseZone().format("YYYY");
}

var helpers = {
  dateFormatter : dateFormat
};

module.exports = helpers;