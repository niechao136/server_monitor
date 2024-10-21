<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { AicsButton, AicsInputText, AicsLogin, AicsModal, AicsTextLabel, LoginModel } from '@/../components'
import { post } from '@/api'
import { COPYRIGHT, EMAIL_REGEXP, LOCAL_KEY, VERSION } from '@/config'
import { getLocal, rmLocal, setLocal } from '@/SRPFramework'
import { startLoading, stopLoading, showTip } from '@/SRPFramework/stores'
import { LoginStore } from '@/stores'

const loginStore = new LoginStore()
const { getVersion, login } = loginStore
@Component({
  components: {
    AicsButton,
    AicsInputText,
    AicsLogin,
    AicsModal,
    AicsTextLabel,
  }
})
export default class Login extends Vue {
  //#region Login

  private remember = false
  private login_form: LoginModel.IUserInfo = {
    account: '',
    password: ''
  }
  private login_footer: LoginModel.IFooter = {
    copyright: COPYRIGHT,
    serverVersion: '',
    webVersion: VERSION,
  }
  protected login_lang: LoginModel.IPagingI18n = {
    welcome: this.$i18n.Login_Welcome,
    title: this.$i18n.Login_Title,
    rememberMe: this.$i18n.Login_Remember,
    forgotPassword: this.$i18n.Login_Forget,
    loginButtonText: this.$i18n.Login_Login,
    accountPlaceholder: this.$i18n.Login_AccPlaceholder,
    accountRequiredErrorMessage: this.$i18n.Login_AccErrorInput,
    passwordPlaceholder: this.$i18n.Login_PwdPlaceholder,
    passwordRequiredErrorMessage: this.$i18n.Login_PwdErrorInput,
  }
  private login_error: LoginModel.IUserInfoError = {
    account: false,
    password: false,
    errorMessage: '',
  }
  private async submitLogin() {
    if (!EMAIL_REGEXP.test(this.login_form.account)) {
      this.login_error = {
        ...this.login_error,
        account: true,
        errorMessage: this.$i18n.Common_EmailFormat,
      }
    } else {
      startLoading('login')
      const res = await login(this.login_form)
      if (res?.status === 1) {
        setLocal(LOCAL_KEY.REMEMBER, this.remember.toString())
        if (this.remember) {
          setLocal(LOCAL_KEY.EMAIL, this.login_form.account)
        } else {
          rmLocal(LOCAL_KEY.EMAIL)
        }
        await this.$router.push('/overview')
      } else {
        this.login_error.errorMessage = this.$i18n[res?.error_code === '1005' ? 'Login_UserStop' : 'Login_Failed']
      }
      stopLoading('login')
    }
  }
  private showForget() {
    this.forget_email = ''
    this.forget_error = ''
    this.show_forget = true
  }
  private rememberMe(checked: string) {
    this.remember = !!checked
  }
  //#endregion
  //#region Forget

  private show_forget = false
  private forget_email = ''
  private forget_error = ''
  private async submitForget() {
    this.forget_error = ''
    if (!this.forget_email) {
      this.forget_error = this.$i18n.Login_ForgetErrorInput
    } else if (!EMAIL_REGEXP.test(this.forget_email)) {
      this.forget_error = this.$i18n.Common_EmailFormat
    }
    if (this.forget_error === '') {
      startLoading('forget')
      const data = { email: this.forget_email }
      const res = await post({ url: 'user/forgetpwd', data })
      let title, msg, type
      if (res?.data?.status === 1) {
        title = this.$i18n.Login_SendSuccess
        msg = this.$i18n.Login_ForgetSuccess
        type = 'successful'
      } else {
        title = this.$i18n.Login_SendFailed
        msg = res?.data?.error_code !== '1009' ? this.$i18n.Login_ForgetFailed
            : this.$i18n.Login_ForgetNotFound.replace('{0}', this.forget_email)
        type = 'error'
      }
      showTip({
        msg, title, type, show_icon: true
      })
      stopLoading('forget')
    }
  }
  //#endregion
  //#region Init

  protected async created() {
    startLoading('login')
    this.remember = getLocal(LOCAL_KEY.REMEMBER) === 'true'
    if (this.remember) {
      this.login_form = {
        account: getLocal(LOCAL_KEY.EMAIL) ?? '',
        password: ''
      }
    }
    await getVersion()
    this.login_footer = {
      ...this.login_footer,
      serverVersion: loginStore.version,
    }
    stopLoading('login')
  }
  //#endregion
}
</script>

<template>
  <div class="login-page">
    <aics-login
        :footer="login_footer"
        :is-remember-me-checked="remember"
        :paging-i18n="login_lang"
        :user-info="login_form"
        :user-info-error="login_error"
        @forgotPassword="showForget"
        @login="submitLogin"
        @rememberMe="rememberMe"
    />
    <aics-modal
        custom-class="forget-dialog"
        title-color="information"
        :is-show="show_forget"
        :title="$i18n.Login_Forget"
        @close="show_forget = false">
      <template #body>
        <div class="dialog--body">
          <div class="dialog--body__form">
            <aics-text-label
                :required="true"
                :text="$i18n.Login_ForgetPlaceholder"
            />
            <aics-input-text
                v-model="forget_email"
                :is-width100-percent="true"
                :is-error="forget_error !== ''"
                :error-message="forget_error"
                :placeholder="$i18n.Login_AccPlaceholder"
                @keyup.enter="submitForget"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <div class="dialog--footer">
          <aics-button
              mode="text"
              variant="secondary"
              :text="$i18n.Button_Cancel"
              @click="show_forget = false"
          />
          <aics-button
              :text="$i18n.Button_Send"
              @click="submitForget"
          />
        </div>
      </template>
    </aics-modal>
  </div>
</template>

<style scoped lang="scss">
.forget-dialog {
  .dialog--body {
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 131px;
    &__form {
      width: 100%;
      padding: 0 0 22px;
    }
  }
}
</style>