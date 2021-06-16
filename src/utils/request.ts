import axios from 'axios'
// import { baseURL, contentType, debounce, requestTimeout, successCode, tokenName } from '@/config'
import configs from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import { isArray } from '@/utils/validate'
import { ElMessage } from 'element-plus'

let loadingInstance: { close: () => void }

const handleCode = (code: any, msg: any) => {
  switch (code) {
    case 401:
      ElMessage.error(msg || '登录失效')
      store.dispatch('user/resetAll').catch()
      break
    case 403:
      router.push({ path: '/401' }).catch()
      break
    default:
      ElMessage.error(msg || `后端接口${code}异常`)
      break
  }
}

const request = axios.create({
  baseURL: configs.baseURL,
  timeout: configs.requestTimeout,
  headers: {
    'Content-Type': configs.contentType
  }
}
)

request.interceptors.request.use(
  (config) => {
    if (store.getters['user/accessToken']) { config.headers[configs.tokenName] = store.getters['user/accessToken'] }
    if (
      config.data &&
        config.headers['Content-Type'] ===
            'application/x-www-form-urlencoded;charset=UTF-8'
    ) { config.data = qs.stringify(config.data) }
    if (configs.debounce.some((item: string) => function () {

    })) {
      // 这里写加载动画
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  (response) => {
    if (loadingInstance) loadingInstance.close()

    const { data, config } = response
    const { code, msg } = data
    // 操作正常Code数组
    const codeVerificationArray = isArray(configs.successCode)
      ? [...configs.successCode]
      : [...[configs.successCode]]
    // 是否操作正常
    if (codeVerificationArray.includes(code)) {
      return data
    } else {
      handleCode(code, msg)
      return Promise.reject(
        JSON.stringify({ url: config.url, code, msg }) || 'Error'
      )
    }
  },
  (error) => {
    if (loadingInstance) loadingInstance.close()
    const { response, message } = error
    if (error.response && error.response.data) {
      const { status, data } = response
      handleCode(status, data.msg || message)
      return Promise.reject(error)
    } else {
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3)
        message = '后端接口' + code + '异常'
      }
      message.error(message || '后端接口未知异常')
      return Promise.reject(error)
    }
  }
)

export default request
