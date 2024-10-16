import { AxiosRequestConfig, AxiosResponse } from 'axios'
import request from './config'

type PostOption<T> = {
  url: string
  data?: T
  config?: AxiosRequestConfig<T>
  base?: string
}

export const post = <T = Result.Base, V = any>(option: PostOption<V>): Promise<AxiosResponse<T>> => {
  const { url, data, config, base } = option
  const query = (base ?? 'api/') + url
  return request.post<T, AxiosResponse<T>, V>(query, data, config)
}
