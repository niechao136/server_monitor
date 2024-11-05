import { Store, Pinia } from 'pinia-class-component'
import { LoginModel } from '@/../components'
import { post } from '@/api'
import { COOKIE_KEY, CRYPTO_KEY } from '@/config'
import { aesDecrypt, aesEncrypt, getCookie, md5Encrypt, rmCookie, setCookie } from '@/utils'

const decryptToken = (token: string) => {
  const decrypted = aesDecrypt(token, CRYPTO_KEY.TOKEN)
  if (decrypted === '') return null
  let decrypted_token: Token.Info
  try {
    decrypted_token = JSON.parse(decrypted)
  } catch (e) {
    return null
  }
  return decrypted_token
}

const checkToken = () => {
  const token = getCookie(COOKIE_KEY.TOKEN)
  return !!token ? decryptToken(token) : null
}

@Store
export class LoginStore extends Pinia {
  //#region Login

  _token: Token.Info = null
  async login(form: LoginModel.IUserInfo) {
    const data = {
      password: md5Encrypt(form.password),
      username: form.account,
    }
    const res = await post<Result.Login>({ url: 'login', data })
    if (res?.data?.status === 1) {
      const { token, user_id } = res.data
      this._token = { token, user_id }
      setCookie(COOKIE_KEY.TOKEN, aesEncrypt(JSON.stringify(this._token), CRYPTO_KEY.TOKEN), null)
    }
    return res?.data
  }
  async logout() {
    const res = await post({ url: 'logout' })
    if (res?.data?.status === 1) {
      rmCookie(COOKIE_KEY.TOKEN)
      this._token = null
    }
  }
  initToken() {
    this._token = checkToken() ?? this._token
  }
  //#endregion
  //#region User

  owner: User.Info = null
  async getOwner() {
    const data = { user_id: this._token?.user_id }
    const res = await post<Result.User>({ url: 'user/info', data })
    if (res?.data?.status === 1) {
      this.owner = res.data?.user ?? {}
      this.current_acc = this.acc_list.find(o => o.id === this.owner?.acc_id)
    }
  }
  //#endregion
  //#region Account

  acc_list: Account.Info[] = []
  current_acc: Account.Info = null
  async getAccList() {
    const res = await post<Result.AccList>({ url: 'user/accountlist' })
    if (res?.data?.status === 1) {
      this.acc_list = res.data?.accs ?? []
      this.current_acc = this.acc_list.find(o => o.id === this.owner?.acc_id)
    }
  }
  async changeAcc(acc_id: string) {
    const res = await post({ url: 'user/changeacc', data: { acc_id } })
    return res?.data
  }
  //#endregion
  //#region Version

  version = ''
  async getVersion() {
    const res = await post<Result.Version>({ url: 'server/info' })
    this.version = res?.data?.version ?? ''
  }
  //#endregion
}

