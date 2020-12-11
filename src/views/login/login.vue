<template>
  <div v-if="show" class="Login">
    <header class="title">智慧能源运营管理平台</header>
    <section class="container-box">
      <div class="container">
        <header class="tabList">
          <span :class="['tab', !isScan && 'activeTab']" @click="isScan = false">账号登录</span>
          <span :class="['tab', isScan && 'activeTab']" @click="isScan = true">扫码登录</span>
        </header>
        <article v-if="!isScan" class="user" @keyup.enter="login">
          <el-input class="input" v-model="username" placeholder="用户名" prefix-icon="el-icon-user" clearable></el-input>
          <el-input class="input" v-model="password" placeholder="密码" prefix-icon="el-icon-lock" show-password clearable></el-input>
          <p class="forgetPwd">忘记密码？</p>
          <el-button class="button" type="primary" @click="login">登录</el-button>
        </article>
        <article v-if="isScan" class="scan">
          <!-- <span class="note">请使用企业微信扫码</span> -->
          <iframe id="iframe"
            src="https://open.work.weixin.qq.com/wwopen/sso/3rd_qrConnect?appid=wxda8561469489f564&amp;redirect_uri=http%3A%2F%2Fess.hyperstrong.net%2Flogin&amp;state=web_login@gyoss9&amp;usertype=member"></iframe>
        </article>
      </div>
    </section>
    <footer class="footer">
      <AppFooter/>
    </footer>
  </div>
</template>
<script>
 import MENUS from '../../assets/js/menus' // 测试时使用
// import setWxOpenData from '@/assets/js/setWxOpenData.js'
import AppFooter from '@/layout/components/Footer'
import { changeSourceWebTitle } from '@/langs/index.js'
export default {
  name: 'login',
  components: {
    AppFooter
  },
  data () {
    return {
      show: false,
      username: '',
      password: '',
      scanUrl: '',
      isScan: true
    }
  },
  methods: {
    // 根据pageInfo获得该用户的操作权限
    getOperations(list) {
      let opetaions = []
      if (!list || list.length < 1) {
        this.$message({
          type: 'error',
          message: '未分配功能权限，请联系管理员'
        })
        return []
      }
      list.forEach(item => {
        if (item.authorities && item.authorities.length > 0) {
          item.authorities.forEach(val => {
            opetaions.push(val.aid)
          })
        }
        if (item.children && item.children.length > 0) {
          opetaions = [...opetaions, ...this.getOperations(item.children)]
        }
      })
      return opetaions
    },
    login () {
      if (this.username === '') {
        this.$message({
          message: '请输入用户名',
          type: 'warning'
        })
        return
      }
      if (this.password === '') {
        this.$message({
          message: '请输入密码',
          type: 'warning'
        })
        return
      }
      let postData = 'username=' + this.username + '&password=' + this.password + '&grant_type=password&client_id=client1&client_secret=123456'
      this.requestLogin(postData)
    },
    requestLogin(postData, from="pwd") {
      let errMessage = '用户名密码错误'
      if (from === 'scan') errMessage = '暂无权限，请联系管理员'
      this.$http.post('/u/oauth/token', postData).then(response => {
        if (response.status === 200 && response.data && response.data.access_token) {
          this.$store.commit('setToken', ('Bearer' || response.data.token_type) + ' ' + response.data.access_token)
          this.$http.get('/u/web/pageInfo').then(res => {
            if (res.data.code === 0) {
              //let pageInfo = MENUS // 测试时使用
              let pageInfo = res.data.data.pageInfo
              let userInfo = res.data.data.userInfo
              // 如果是admin用户，删除角色管理和用户管理功能
              if (userInfo && userInfo.uid === 'o1sUPeRMan') {
                pageInfo.forEach(item => {
                  if (item.mid === 'Z') {
                    let children =[]
                    item.children.forEach(item2 => {
                      if (item2.mid === 'ZC') {
                        children.push(item2)
                      }
                    })
                    item.children = [...children]
                  }
                  return item
                })
              }
              // 存进store和sessionStorage中
              this.$store.commit('setPageInfo', pageInfo)
              this.$store.commit('setUserInfo', userInfo)
              // 更改langs中的webTitle
              changeSourceWebTitle({
                cn: userInfo.organization && userInfo.organization.oTitle || '智慧能源运营管理平台',
                en: userInfo.organization && userInfo.organization.oTitle || '智慧能源运营管理平台',
              })
              // 剥离出该用户的操作权限,存入store和session中
              this.$store.commit('setOperations', this.getOperations(pageInfo))
              let firstPage = pageInfo[0].menuUrl || pageInfo[0].children[0].menuUrl
              // if (userInfo.roles.includes('管理员')) {
              //   setWxOpenData.config(document.body, userInfo.organization.oid)
              // }
              this.$router.push({path: firstPage})
            }
          }).catch(() => {
            this.show = true
            this.$message.error('登录失败，请重试')
          })
        }else {
          this.show = true
          this.$message.error(errMessage)
        }
      }).catch(error => {
        this.show = true
        if (error.message.includes('timeout')) {
          this.$message.error('请求超时')
          return
        }
        this.$message.error(errMessage)
      })
    },
    dealLocation() {
      const noScanNextCb = () => {
        this.init()
        this.show = true
      }
      this.show = false
      let query = window.location.search
      if (query) {
        let au = query.split('&')[0]
        if (au.includes('auth_code')) {
          let code = au.split('=')[1]
          if (code) {
            this.$http.get('/u/weChat/getUserInfoByAuthCode?authCode=' + code).then(res => {
              if (res && res.data.code === 0) {
                let name = res.data.data
                if (name) {
                  let postData = 'username=' + name + '&password=' + name + '&grant_type=password&client_id=client1&client_secret=123456'
                  this.requestLogin(postData, 'scan')
                }else {
                  noScanNextCb()
                }
              }else {
                noScanNextCb()
                this.$message.error(res.data.message)
              }
            }).catch(() => {
              this.$message.error('当前账号不可用，请联系管理员')
              noScanNextCb()
            })
          }else {
            noScanNextCb()
          }
        }else {
          noScanNextCb()
        }
      }else {
        noScanNextCb()
      }
    },
    init() {
      let pageInfo = JSON.parse(sessionStorage.getItem('pageInfo'))
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
      if (pageInfo && userInfo) {
        let firstPage = pageInfo[0].menuUrl
        this.$router.push({path: firstPage})
      }
    }
  },
  mounted () {
    this.dealLocation()
  }
}
</script>
<style lang="scss" scoped>
  .Login {
    width: 100vw;
    height: 100vh;
    background-image: url('~@/assets/imgs/login/login-background.jpg');
    background-size: 100% 100%;
    .title {
      // font-size: 2.2rem;
      // letter-spacing: 1rem;
      text-align: center;
      // height: 100px;
      // line-height: 100px;
      height: 10vh;
      line-height: 10vh;
    }
    .container-box {
      // width: 50%;
      max-width: 1034px;
      // height: 584px;
      margin-left: 50%;
      // margin-top: 20vh;
      transform: translateX(-50%);
      background-image: url('~@/assets/imgs/login/container.png');
      background-size: 100%;
      background-repeat: no-repeat;
      .container {
        width: 50%;
        height: 100%;
        margin-left: 25%;
        overflow: hidden;
        .tabList {
          padding: 0 50px;
          // height: 100px;
          margin-top: 10px;
          margin-bottom: 10px;
          .tab {
            display: inline-block;
            width: 50%;
            // line-height: 100px;
            text-align: center;
            font-size: 1.2rem;
            color: $color-font-secondery;
            cursor: pointer;
          }
          .activeTab {
            color: $color-el-primary;
          }
        }
        .user {
          .forgetPwd {
            // margin-top: -10px;
            font-size: .875rem;
            text-align: right;
            color: $color-font-secondery;
          }
          .button {
            // margin-top: 50px;
            width: 100%;
            font-weight: 500;
            letter-spacing: 10px;
          }
        }
        .scan {
          position: relative;
          width: 100%;
          height: 340px;
          overflow: hidden;
          .note {
            position: absolute;
            bottom: 15px;
            left: 0;
            right: 0;
            text-align: center;
            font-size: .75rem;
            color: #333;
            letter-spacing: 1px;
          }
          #iframe {
            position: absolute;
            top: -35px;
            left: 0;
            right: 0;
            width: 100%;
            height: 500px;
            border: 0;
            .result_text {
              color: #fff;
            }
          }
        }
      }
    }
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
  @media screen and (min-width: 1600px) {
    .title {
      font-size: 2.2rem;
      letter-spacing: 1rem;
    }
    .container-box {
      width: 50%;
      margin-top: 20vh;
      height: 584px;
      .tabList {
        height: 100px;
        .tab {
          line-height: 100px;
        }
      }
      .user {
        margin-top: 50px;
        overflow: hidden;
        .input {
          margin-bottom: 20px;
        }
        .button {
          margin-top: 50px;
        }
        .forgetPwd {
          margin-top: -10px;
        }
      }
    }
  }
  @media screen and (max-width: 1599px) {
    .title {
      font-size: 1.8rem;
      letter-spacing: .8rem;
    }
    .container-box {
      width: 55%;
      margin-top: 12vh;
      height: 470px;
      .tabList {
        height: 80px;
        .tab {
          line-height: 80px;
        }
      }
      .input {
        margin-bottom: 10px;
      }
      .button {
        margin-top: 30px;
      }
      .forgetPwd {
        margin-top: 0
      }
      .scan {
        margin-top: -35px;
      }
    }
  }
</style>
<style lang="scss">
.Login {
  .container-box {
    .container {
      .user {
        padding: 0 20px;
        .input {
          // margin-bottom: 20px;
          background: $color-background;
          .el-input__inner {
            font-size: 1rem;
            height: 50px;
            padding: 0 35px;
          }
          .el-input__prefix, .el-input__suffix {
            .el-input__icon {
              font-size: 1.2rem;
              line-height: 50px;
            }
          }
        }
        .button {
          span {
            font-size: 1rem;
          }
        }
      }
      .scan {
        #iframe {
          .result_text {
            color: #fff;
          }
        }
      }
    }
  }
}
</style>


