const trigger = '!!! ';
const reportConfig = {
  report: {
    template: {
        text: '###请复制下面的模板到输入框,填写[ ]再次发送即可',
        attachments: [
          {
            title: `${trigger} 复制的时候请连我一起复制`,
            text: '周六 已完成任务[  ],未完成任务[  ],原因及对策[  ],\n\
                  周日 已完成任务[  ],未完成任务[  ],原因及对策[  ],\n\
                  周一 已完成任务[  ],未完成任务[  ],原因及对策[  ],\n\
                  周二 已完成任务[  ],未完成任务[  ],原因及对策[  ],\n\
                  周三 已完成任务[  ],未完成任务[  ],原因及对策[  ],\n\
                  周四 已完成任务[  ],未完成任务[  ],原因及对策[  ],\n\
                  周五 已完成任务[  ],未完成任务[  ],原因及对策[  ],\n\
                  周六 已完成任务[  ],未完成任务[  ],原因及对策[  ],\n\
                  周日 已完成任务[  ],未完成任务[  ],原因及对策[  ]\n\
            ',
            color: '#666666',
          },
        ],
      },
    brakets: 27,
  },
  trigger: {
    init: [`${trigger} 周报`, `${trigger} zhoubao`, `${trigger} z`],
    update: [`${trigger} 复制的时候请连我一起复制`],
  },
};
module.exports = reportConfig;
