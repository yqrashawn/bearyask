/* eslint no-else-return:['off'] max-len:['error',400] indent:['error',2] new-cap:['off'] no-unused-vars:['off'] no-console:['off']*/
const config = require('../report-config.js');
const S = require('string');
const mongoose = require('mongoose');
const fs = require('fs');

class HandleReport {
  /**
   * Inspect if user input is the init deliver trigger
   *
   * @access public
   * @static
   * @param {String} str user input string
   * @returns {Bool} true if is one of the preset init triggers
   */
  static ifDeliverReports(str) {
    return this.ifIsTrigger(str, config.trigger.deliver);
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
    if (option !== undefined) {
      throw Error('not impl yet');
    }

    let flag = false;
    triggers.forEach((trigger) => {
      if (S(str).startsWith(trigger)) {
        flag = true;
      }
    });
    return flag;
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
    const arr = S(str).splitLeft(',');
    const valueArr = [];
    arr.forEach((bracketStr) => {
      let strInBracket = S(bracketStr).between('[', ']').s;
      if (!strInBracket.length) {
        strInBracket = ' ';
      }

      valueArr.push(strInBracket);
    });
    const query = { userName: user };
    this.Reports.findOneAndUpdate(query, {
      userName: user,
      arr: valueArr,
    }, {
      new: true,
      upsert: true,
    }, (err) => {
      callback(err);
      if (err) {
        throw Error(err);
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
    const userSchema = mongoose.Schema({
      userName: String,
      name: String,
      department: String,
      to: Array,
      cc: String,
    });
    this.Users = mongoose.model('Users', userSchema);
    this.Reports = mongoose.model('Reports', reportSchema);
  }

  static initCSVTemplate(callback) {
    this.findAllInDb('Users', (users) => {
      const usersObj = {};
      users.forEach((user) => {
        usersObj[user.userName] = user;
      });
      this.usersObj = usersObj;
      console.log(usersObj);
      this.findAllInDb('Reports', (reports) => {
        reports.forEach((report, i) => {
          let csv = JSON.parse(JSON.stringify(config.report.csvTemplate));
          csv = csv.replace(/\[\d+\]/g, (match) => {
            let index = S(match).between('[', ']').s;
            if (index === '28') {
              return usersObj[report.userName].name;
            }

            if (index === '29') {
              return usersObj[report.userName].department;
            }

            if (index === '30') {
              const d = new Date();
              return `${d.toDateString()}`;
            }

            return report.arr[index - 1].toString();
          });
          fs.writeFileSync(`${config.fileDir}${S(report.userName).strip(' ').s}.csv`, csv);
          if (i === reports.length - 1 && callback) {
            callback();
          }
        });
      });
    }); // TODO: combine csv with same reciever
  }

  static findAllInDb(model, callback) {
    this[model].find({}, (err, reports) => {
      if (!err && reports.length) {
        callback(reports);
      } else {throw Error(err);};
    });
  }

  static renderCSV(reportJson) {

  }

  /**
   * enter data from db into template
   *
   * @access public
   * @static
   * @param {Object} reportJson user input data from db
   * @returns {Object} weekly report for user to modify
   */
  static inputJson(reportJson) {
    const template = JSON.parse(JSON.stringify(config.report.template));
    template.attachments[0].text = template.attachments[0].text.replace(/\d+/g, (match) => reportJson.arr[match - 1].toString());
    return template;
  }

  static ifInit(userInputText) {
    return this.ifIsTrigger(userInputText, config.trigger.init);
  }

  /**
   * init user name, who to sent weekly report to, which department, findOne in db first
   *
   * @access public
   * @static
   * @returns {Object} init user info template
   */
  static initUserInfo(userName, callback) {
    const query = {
      userName,
    };
    this.Users.findOne(query, (err, user) => {
      if (user) {
        const initTemplate = JSON.parse(JSON.stringify(config.report.initUserInfoTemplate));
        initTemplate.attachments[0].text = initTemplate.attachments[0].text.replace(/\d+/g, (match) => {
            if (Object.keys(user)[match - 1] instanceof Array) {
              let str = '';
              Object.keys(user)[match - 1].forEach((email, i) => {
                str += `${email},`;
              });
              return str;
            } else {
              return Object.keys(user)[match - 1].toString();
            }
          });
        if (callback) {
          callback(initTemplate);
        }

        return initTemplate;
      } else {
        const initTemplate = JSON.parse(JSON.stringify(config.report.initUserInfoTemplate));
        initTemplate.attachments[0].text = initTemplate.attachments[0].text.replace(/\[\d+\]/g, '[  ]');
        if (callback) {
          callback(initTemplate);
        }

        return initTemplate;
      }
    });
  }

  static ifSaveInit(str) {
    return this.ifIsTrigger(str, config.trigger.saveInit);
  }

  static saveInit(user, initInfo, callback) {
    const arr = S(initInfo).splitLeft('&');
    const valueArr = [];
    arr.forEach((bracketStr, i) => {
      let str = S(bracketStr).between('[', ']').s;
      if (!str.length) {
        str = ' ';
      }

      valueArr.push(str);
    });
    if (valueArr[3]) {
      const emailsArr = S(valueArr[3]).splitLeft(',');
      emailsArr.forEach((email, index) => {
        emailsArr[index] = S(email).strip(' ').s;
      });
      valueArr[3] = emailsArr;
      if (!emailsArr.length) {
        throw Error('no email address entered');
      }
    }

    const name = S(valueArr[1]).strip(' ').s;
    const department = S(valueArr[2]).strip(' ').s;
    const to = valueArr[3];
    const cc = valueArr[4] ? S(valueArr[4]).strip(' ').s : valueArr[4]; // may is undefined
    const query = { userName: user };
    this.Users.findOneAndUpdate(query, {
      userName: user,
      name,
      department,
      to,
      cc,
    }, {
      new: true,
      upsert: true,
    }, (err, userData) => {
      if (callback) {
        callback(err);
      }
    });
  }
}

HandleReport.initDb();
module.exports = HandleReport;
