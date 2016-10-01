const express = require('express');
const router = express.Router();
const config = require('../config.json');
const S = require('string');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/ask', function (req, res) {
  console.log(req.body);
  const text = req.body.text;
  let str;
  S.extendPrototype();
  str = text.chompLeft('!!!!!').s;
  S.restorePrototype();

  res.send({
    text: '###请复制下面的模板到输入框,填写[ ]再次发送即可',
    attachments: [
      {
        title: '周报',
        text: '周六 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周日 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n',
        color: '#666666',
        images: [
          {
            url: 'http://example.com/index.jpg',
          },
          {
            url: 'http://example.com/index.jpg',
          },
        ],
      },
    ],
  });

});

router.get('/ask', function (req, res) {
  res.render('index', { title: 'Express' });
  console.log(req.body);
  res.sendStatus(200);
});

module.exports = router;
