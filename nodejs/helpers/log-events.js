const fs = require('fs').promises;
const path = require('path');
const {format} = require('date-fns')
const filename = path.join(__dirname, '../logs', 'logs.log');

const logEvents = async (msg) => {

  const contentLog = `${format(new Date(),'dd-mm-yyyy HH:mm:ss')}----${msg}\n`

  try {
    fs.appendFile(filename, contentLog);
  } catch (error) {
    console.log(error);
  }
};

module.exports = logEvents;
