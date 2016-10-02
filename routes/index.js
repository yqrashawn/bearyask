/* eslint indent:['error',2] new-cap:['off']*/
const express = require('express');
const reportConfig = require('../report-config.js');
const handleReport = require('./handleReport.js');
require('../schedule.js');

const router = express.Router();
// GET home page.
router.post('/ask', (req, res) => {
  const userInputText = req.body.text;
  const user = req.body.user_name;
  const channel = req.body.channel_name;

  try {
    // multiple choice
    if (handleReport.ifDeliverReports(userInputText)) {
      const query = { userName: user };
      if (!handleReport.Reports) {
        handleReport.initDb();
      }

      handleReport.Reports.findOne(query, (err, report) => {
        if (err) {
          throw Error(err);
        } else if (!report) {
          const template = JSON.parse(JSON.stringify(reportConfig.report.template));
          template.attachments[0].text = template.attachments[0].text.replace(/\[\d+\]/g, '[   ]');
          res.send(template);
        } else {
          res.send(handleReport.inputJson({
            userName: report.userName,
            arr: report.arr,
          }));
        }
      });
    } else if (handleReport.ifUpdate(userInputText)) {
      handleReport.renderJSON(userInputText, user, channel, (err) => {
        if (!err) {
          res.send(reportConfig.report.successTemplate);
        } else {
          res.send(err);
        }
      });
    } else if (handleReport.ifInit(userInputText)) {
      handleReport.initUserInfo(user, (template) => {
        res.send(template);
      });
    } else if (handleReport.ifSaveInit(userInputText)) {
      handleReport.saveInit(user, userInputText, (err) => {
        if (err) {
          res.sendStatus(500);
          throw Error(err);
        } else {
          res.send(reportConfig.report.successTemplate);
        }
      });
    }
  } catch (e) {
    throw Error(e);
  }
});

router.get('/ask', (req, res) => {
  res.render('index', { title: 'Express' });
  res.sendStatus(200);
});

module.exports = router;
