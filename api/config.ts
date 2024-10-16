import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Vue } from 'vue-property-decorator'
import { Environment } from '@/config'
import { closeLoading, closeTip, errorToast, showTip } from '@/SRPFramework/stores'

const config: AxiosRequestConfig = {
  timeout: 300 * 1000, // Timeout
  baseURL: Environment.BaseUrl.api,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
  }
}

const service = axios.create(config)

service.interceptors.request.use(
    config => {
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
