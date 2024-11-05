import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Vue } from 'vue-property-decorator'
import { COOKIE_KEY, Environment } from '@/config'
import router from '@/config/router'
import { closeLoading, closeTip, errorToast, showTip } from '@/SRPFramework/stores'
import { LoginStore } from '@/stores'
import { rmCookie } from '@/utils'

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
    async (config) => {
      if (!NOT_NEED_TOKEN.find(o => config.url.endsWith(o))) {
        const token = new LoginStore()._token?.token
        if (!token) {
          closeLoading()
          await router.push({ path: '/login' })
          return Promise.reject({ status: 2 })
        }
        config.data = {
          ...config.data,
          token,
        }
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
)

service.interceptors.response.use(
    async (response: AxiosResponse<Result.Base>) => {
      let status = Number(response?.data?.status), error_code = String(response?.data?.error_code)
      if (status === 0 && ['403'].includes(error_code)) {
        closeLoading()
        await router.push({ path: '/login' })
        return Promise.reject(response.data)
      }
      else if (status === 0 && ['1024'].includes(error_code)) {
        const submit = async () => {
          closeTip()
          rmCookie(COOKIE_KEY.TOKEN)
          await router.push({ path: '/login' })
        }
        closeLoading()
        showTip({
          close_backdrop: false,
          msg: Vue.prototype.$i18n.logoutMsg,
          show_cancel: false,
          submit,
          title: Vue.prototype.$i18n.logoutTitle,
          type: 'warning'
        })
        return Promise.reject(response.data)
      }
      return response
    },
    error => {
      closeLoading()
      if (![0, 2, 3].includes(error?.status)) {
        errorToast('Network Error')
      }
      return Promise.reject(error)
    }
)

export default service
