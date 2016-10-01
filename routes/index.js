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
  str = text.chompLeft('!!!').s;
  S.restorePrototype();

  res.send({
    text: '###请复制下面的模板到输入框,填写[ ]再次发送即可',
    attachments: [
      {
        title: '!!! (复制的时候请连我一起赋值)周报',
        text: '周六 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周日 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周一 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周二 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周三 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周四 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周五 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周六 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n周日 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n',
        color: '#666666',
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
