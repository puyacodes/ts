const { ts } = require('./Timestamper')
const cli = require('./TimestamperCLI');

module.exports.Timestamper = ts;
module.exports.ts = ts;
module.exports.TimestamperCLI = cli;