const schedule = require('node-schedule');
const handleReport = require('./routes/handleReport.js');
const reportConfig = require('./report-config.js');
const S = require('string');
const mongoose = require('mongoose');
const fs = require('fs');
const archiver = require('archiver');
const nodemailer = require('nodemailer');

const poolConfig = {
    pool: true,
    host: 'smtp.live.com',
    port: 587,
    secure: false, // use SSL
    auth: {
        user: 'namy.19@hotmail.com',
        pass: '',
      },
    connectionTimeout: 200000,
  };
const transporter = nodemailer.createTransport(poolConfig);
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

class Schedule {
  static startSchedule() {
    // const sch = schedule.scheduleJob(reportConfig.schedule.deliver, () => {
    handleReport.initCSVTemplate(() => {
      const output = fs.createWriteStream('./public/Reports.zip');
      const archive = archiver('zip');
      output.on('close', () => {
          console.log(archive.pointer() + ' total bytes');
          console.log('archiver has been finalized and the output file descriptor has closed.');
        });

      archive.on('error', function (err) {
          throw Error(err);
        });

      archive.pipe(output);
      archive.bulk([
          { expand: true, cwd: reportConfig.fileDir, src: ['**'], dest: 'Reports' },
      ]);
      archive.finalize();
      // TODO: distribute
      this.readAllfileAndEmail();
    });
    // });
  }

  static readAllfileAndEmail(callback) {
    const files = fs.readdirSync(`${reportConfig.fileDir}`);
    const users = handleReport.usersObj;
    console.log(files);
    files.forEach((filename) => {
      if (filename !== '.DS_Store') {
        const userName = S(filename).chompRight('.csv').s;
        let to = '';
        users[userName].to.forEach((email) => {
          to += `${S(email).strip(' ').s},`;
        });
        to = S(to).chompRight(',').s;
        const message = {
          text: ``,
          from: '"yqrashawn" <yqrashawn@gmail.com>',
          to,
          cc: users[userName].cc,
          subject: `${users[userName].name}的周报`,
          attachments: [
            { filename:filename, path: `./public/download/${filename}`, contentType: 'text/csv' },
          ],
        };
        transporter.sendMail(message, (error, info) => {
            if (error) {
              return console.log(error);
            }

            console.log('Message sent: ' + info.response);
          });
      }
    });
  }
}

// mongoose.connection.collections['reports'].drop((err) => {
// if (err) {
// console.log(err);
// }else{
// console.log('collection droped');
// }
// });
module.exports = Schedule;
Schedule.startSchedule();
