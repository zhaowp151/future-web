module.exports = {
    ip: "192.168.88.128", // ssh地址
    username: "root", // ssh 用户名
    port:"22",      //端口
    password: "123456", // ssh 密码
    path: '/usr/local/nginx/html/prod', // 操作开始文件夹 可以直接指向配置好的地址
    rmpath: '/usr/local/nginx/html/prod', // 需要删除的文件夹
    dirpath: '../../prod' // 上传的文件夹
  }