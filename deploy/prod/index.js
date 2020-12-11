const config = require('./config.js')

const path = require('path');
let Client = require('ssh2-sftp-client');

async function connectSSh() {
  let sftp = new Client();
  sftp.connect({
    host: config.ip, // 服务器 IP
    port: config.port,
    username: config.username,
    password: config.password
  }).then(() => {
    console.log("先执行删除服务器文件")
    return sftp.rmdir(config.rmpath, true);
  }).then(() => {
    // 上传文件
    console.log("开始上传")
    return sftp.uploadDir(path.resolve(__dirname, config.dirpath), config.path);
  }).then(() => {
    console.log("上传完成");
    sftp.end();
  }).catch((err) => {
    console.log(err, '失败');
    sftp.end();
  });
}
async function runTask() {
  await connectSSh()      //提交上传
}
runTask()