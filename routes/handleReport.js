const config = require('../report-config.js');
const S = require('string');

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
        if (!S(str).startsWith(trigger)) {
          flag = true;
        }
      });
      return flag;
    }
  }

  static renderJSON(str){
    let arr = S(str).splitLeft(',');
    console.log(arr);
  }
}

module.exports = HandleReport;
