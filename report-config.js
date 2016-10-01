const trigger = '!!! ';
const reportConfig = {
  report: {
    template: {
        text: '###请复制下面的模板到输入框,填写[ ]再次发送即可',
        attachments: [
          {
            title: `${trigger} 复制的时候请连我一起复制`,
            text: '周六 已完成任务[1],未完成任务[2],原因及对策[3],\n\
                  周日 已完成任务[4],未完成任务[5],原因及对策[6],\n\
                  周一 已完成任务[7],未完成任务[8],原因及对策[9],\n\
                  周二 已完成任务[10],未完成任务[11],原因及对策[12],\n\
                  周三 已完成任务[13],未完成任务[14],原因及对策[15],\n\
                  周四 已完成任务[16],未完成任务[17],原因及对策[18],\n\
                  周五 已完成任务[19],未完成任务[20],原因及对策[21],\n\
                  周六 已完成任务[22],未完成任务[23],原因及对策[24],\n\
                  周日 已完成任务[25],未完成任务[26],原因及对策[27]\n\
            ',
            color: '#666666',
          },
        ],
      },
    brakets: 27,
    successTemplate: {
            text: '###保存成功',
            attachments: [
              {
                title: `:grnning:`,
              },
            ],
          },
  },
  trigger: {
    init: [`${trigger}周报`, `${trigger}zhoubao`, `${trigger}z`],
    update: [`${trigger}复制的时候请连我一起复制`],
  },
};
module.exports = reportConfig;
