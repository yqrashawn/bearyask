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
    text: 'text, this field may accept markdown',
    attachments: [
      {
        title: 'title_1',
        text: 'attachment_text',
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
