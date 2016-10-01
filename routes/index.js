const express = require('express');
const reportConfig = require('../report-config.js');
const handleReport = require('./handleReport.js');

const router = express.Router();

// GET home page.
router.post('/ask', function (req, res) {
  const userInputText = req.body.text;
  const user = req.body.user_name;
  const channel = req.body.channel_name;

  try {
    // multiple choice
    if (handleReport.ifInit(userInputText)) {
      const query = { userName: user };
      if (!handleReport.Reports) {
        handleReport.init();
      }

      handleReport.Reports.findOne(query, (err, report) => {
        if (err) {
          console.log(err);
        } else if (!report) {
          console.log('new user');
          const template = reportConfig.report.template;
          template.attachments[0].text = template.attachments[0].text.replace(/\[\d+\]/g, '[   ]');
          res.send(template);
        } else {
          res.send(handleReport.inputJson(report));
        }
      });
    } else if (handleReport.ifUpdate(userInputText)) {
      handleReport.renderJSON(userInputText, user, channel, (err) => {
        if (!err) {
          const template = reportConfig.template;
          template.attachments[0].text = '保存成功';
          res.sendStatus(template);
        }else{
         res.send(err);
        }
      });
    }
  } catch (e) {
    console.trace(e);
  }
});

router.get('/ask', function (req, res) {
  res.render('index', { title: 'Express' });
  console.log(req.body);
  res.sendStatus(200);
});

module.exports = router;
