const config = require('../report-config.js');
const S = require('string');
const mongoose = require('mongoose');

class HandleReport {
  /**
   * Inspect if user input is the init trigger
   *
   * @access public
   * @static
   * @param {String} str user input string
   * @returns {Bool} true if is one of the preset init triggers
   */
  static ifInit(str) {
    return this.ifIsTrigger(str, config.trigger.init);
  }

  /**
   * Inspect if user input is the update trigger
   *
   * @access public
   * @static
   * @param {String} str user input string
   * @returns {Bool} true if is one of the preset update triggers
   */
  static ifUpdate(str) {
    return this.ifIsTrigger(str, config.trigger.update);
  }

  /**
   * Inspect if the input string is start with one of / some of the given triggers
   *
   * @access public
   * @static
   * @param {String} str User input string
   * @param {Array} triggers Preset triggers to match
   * @param {Num} option 0 for 'one of', 1 for 'some of', default is one of
   * @returns {Bool} true if eligible
   */
  static ifIsTrigger(str, triggers, option) {
    if (option === undefined) {
      let flag = false;
      triggers.forEach((trigger, i) => {
        if (S(str).startsWith(trigger)) {
          flag = true;
        }
      });
      return flag;
    }
  }

  /**
   * handle the respond template, get value in bracket, save in db as array
   *
   * @access public
   * @static
   * @param {String} str template from res
   * @returns {Object} json for data saving
   */
  static renderJSON(str, user, channel, callback) {
    this.user = user;
    this.channel = channel;
    let arr = S(str).splitLeft(',');
    let valueArr = [];
    arr.forEach((bracketStr, i) => {
      let str = S(bracketStr).between('[', ']').s;
      if (!str.length) {
        str = ' ';
      }

      valueArr.push(str);
    });
    const query = { userName: user };
    this.Reports.findOneAndUpdate(query, {
      userName: user,
      arr: valueArr,
    }, {
      new: true,
      upsert: true,
    }, (err, report) => {
      callback(err);
      if (err) {
        console.log(err);
      }
    });
  }

  static initDb() {
    mongoose.connect('mongodb://127.0.0.1:27017/weekly-report');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    const reportSchema = mongoose.Schema({
      userName: String,
      arr: Array,
    });
    this.Reports = mongoose.model('Reports', reportSchema);
  }

  static initCSVTemplate() {

  }

  static renderCSV(reportJson) {

  }

  static inputJson(reportJson) {
    const template = JSON.parse(JSON.stringify(config.report.template));
    console.log(template);
    template.attachments[0].text =  template.attachments[0].text.replace(/\d+/g, (match) => {
        return reportJson.arr[match - 1].toString();
      });
    console.log(template.attachments[0].text);
    return template;
  }
}

HandleReport.initDb();
module.exports = HandleReport;
