const schedule = require('node-schedule');
const handleReport = require('./routes/handleReport.js');
const reportConfig = require('./report-config.js');
const mongoose = require('mongoose');
const fs = require('fs');
const archiver = require('archiver');

class Schedule {
  static startSchedule() {
    const sch = schedule.scheduleJob(reportConfig.schedule.deliver, () => {
      handleReport.initCSVTemplate(() => {
        const output = fs.createWriteStream('./public/Reports.zip');
        const archive = archiver('zip');
        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
          });

        archive.on('error', function (err) {
            throw err;
          });

        archive.pipe(output);
        archive.bulk([
            { expand: true, cwd: reportConfig.fileDir, src: ['**'], dest: 'Reports' },
        ]);
        archive.finalize();
      });
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
