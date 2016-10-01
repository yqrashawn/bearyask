const express = require('express');
const reportConfig = require('../report-config.js');
const handleReport = require('./handleReport.js');

const router = express.Router();

// GET home page.
router.post('/ask', function (req, res) {
  const userInputText = req.body.text;

  try {
    console.log(userInputText);
    // multiple choice
    if (handleReport.ifInit(userInputText)) {
      res.send(reportConfig.report.template);
    } else if (handleReport.ifUpdate(userInputText)) {
      handleReport.renderJSON(userInputText);
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
