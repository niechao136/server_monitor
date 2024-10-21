import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Vue } from 'vue-property-decorator'
import { Environment } from '@/config'
import { closeLoading, closeTip, errorToast, showTip } from '@/SRPFramework/stores'
import { LoginStore } from '@/stores'

const config: AxiosRequestConfig = {
  timeout: 300 * 1000, // Timeout
  baseURL: Environment.BaseUrl.api,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }
}

const service = axios.create(config)

const NOT_NEED_TOKEN: string[] = [
  'server/info',
  'login',
  'user/forgetpwd',
  'user/resetpwd',
]

service.interceptors.request.use(
    config => {
      if (!NOT_NEED_TOKEN.find(o => config.url.endsWith(o))) {
        config.data = {
          ...config.data,
          token: new LoginStore()._token.token
        }
      }
      return config
    },
    error => {
      closeLoading()
      errorToast('Request Error')
      return Promise.reject(error)
    }
)

service.interceptors.response.use(
    response => {
      return response
    },
    error => {
      closeLoading()
      errorToast('Network Error')
      return Promise.reject(error)
    }
)

export default service
