<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { AicsButton, AicsCardContainer, AicsDivider, AicsDropdown, AicsInputPassword, AicsTooltip, LoginModel } from '@/../components'
import { I18nNamespace, I18nService, UtilityService } from '@/../helpers'
import { post } from '@/api'
import { COPYRIGHT, VERSION } from '@/config'
import { errorToast, infoToast, startLoading, stopLoading } from '@/SRPFramework/stores'
import { LoginStore } from '@/stores'
import { md5Encrypt } from '@/utils'

const loginStore = new LoginStore()
const { getVersion } = loginStore
@Component({
  components: {
    AicsDropdown,
    AicsTooltip,
    AicsButton,
    AicsCardContainer,
    AicsDivider,
    AicsInputPassword,
  }
})
export default class resetpwd extends Vue {
  private backgroundImage = `url("${__webpack_public_path__ + 'background-login.png'}")`
  private logoImg = __webpack_public_path__ + 'logo-login.png'
  protected get footerData(): LoginModel.IFooter {
    return {
      copyright: COPYRIGHT,
      serverVersion: loginStore.version,
      webVersion: VERSION,
    }
  }
  private languageValue: I18nNamespace.ILanguageOption = I18nService.languageoptions.find((n) => n.key === I18nService.currentLanguage)
  private languageOptions: I18nNamespace.ILanguageOption[] = I18nService.languageoptions
  private async languageChange(value: I18nNamespace.ILanguageOption) {
    startLoading('language')
    const data = { prefer_lang: value.key }
    const res = await post({ url: 'user/lang/update', data })
    if (res?.data?.status === 1) {
      I18nService.currentLanguage = value.key as I18nNamespace.II18nKey
    }
    stopLoading('language')
  }
  private idLogin = `${new Date().getTime().toString()}_${UtilityService.RandomText(10, { symbol: false })}`
  private idErrorMessage = `${new Date().getTime().toString()}_${UtilityService.RandomText(10, { symbol: false })}`
  private showErrorMessageDots = false
  private password = ''
  private confirm = ''
  private error = {
    password: false,
    confirm: false,
  }
  private errorMessage = ''
  private isDisabled = true
  private get vk() {
    return this.$route.query.VK ?? this.$route.query.vk
        ?? this.$route.query.Vk ?? this.$route.query.vK
  }
  private get is_reset() {
    return (this.vk ?? null) !== null
  }
  private inputPassword(target: 'password' | 'confirm') {
    if (target === 'password') {
      this.error.password = !this.password
      this.errorMessage = !!this.password ? '' : this.$i18n.Common_Enter
    } else {
      this.error.confirm = !this.confirm
      this.errorMessage = !!this.confirm ? '' : this.$i18n.Common_Enter
    }
    this.isDisabled = !(!!this.password && !!this.confirm)
    if (!this.errorMessage) {
      this.errorMessage = this.confirm === this.password ? '' : this.$i18n.Reset_Tip_Same
    }
  }
  private errorMessageMouseenter() {
    let parent: HTMLElement = document.getElementById(this.idErrorMessage);
    if (!!parent) {
      let element: HTMLElement = parent.querySelector('.login--content__input-error-message__content');
      if (!!element && element.clientWidth !== 0) {
        this.showErrorMessageDots = element.scrollWidth > element.clientWidth;
      }
    }
  }
  private async submitClick() {
    if (this.is_reset && !this.vk) {
      errorToast(this.$i18n.Reset_Tip_Error)
      return
    }
    this.inputPassword('password')
    this.inputPassword('confirm')
    if (!this.errorMessage) {
      startLoading('submit password')
      const newPassword = md5Encrypt(this.password)
      let result: Result.Base
      if (this.is_reset) {
        const data = { newPassword, resetPasswordKey: this.vk }
        const res = await post<Result.Base>({ url: 'user/resetpwd', data })
        result = res?.data
      } else {
        const data = { new_password: newPassword, user_id: loginStore.owner?.user_id }
        const res = await post<Result.Base>({ url: 'user/changepwd', data })
        result = res?.data
      }
      if (result?.status === 1) {
        await this.$router.push('/login')
        infoToast(this.$i18n.Reset_Success_Tip)
      } else {
        errorToast(this.$i18n.Reset_Failed_Tip)
      }
      stopLoading('submit password')
    }
  }
  private async backToLogin() {
    await this.$router.push('/login')
  }
  protected async created() {
    startLoading('password')
    await getVersion()
    stopLoading('password')
  }
}
</script>

<template>
  <div class="login password" :style="{ backgroundImage }">
    <div class="login--content">
      <div class="login--content__title">{{ $i18n.Common_changePassword }}</div>
      <div class="login--content__input">
        <aics-card-container variant="1px">
          <div class="login--content__input-box">
            <aics-input-password
                v-model="password"
                variant="grayscale-primary"
                :placeholder="$i18n.Reset_Label_New"
                :is-error="error.password"
                :is-width100-percent="true"
                @blur="inputPassword('password')"
                @input="inputPassword('password')"
                @change="inputPassword('password')"
            />
          </div>
          <aics-divider
              class="login--content__input-divider"
              variant="light"
              size="1"
              direction="horizontal"
          />
          <div class="login--content__input-box">
            <aics-input-password
                v-model="confirm"
                variant="grayscale-primary"
                :placeholder="$i18n.Reset_Label_Again"
                :is-error="error.confirm"
                :is-width100-percent="true"
                @blur="inputPassword('confirm')"
                @input="inputPassword('confirm')"
                @change="inputPassword('confirm')"
            />
          </div>
        </aics-card-container>

        <div
            class="login--content__input-error-message"
            tabindex="-1"
            :id="idErrorMessage"
            @mouseenter="errorMessageMouseenter"
        >
          <div
              class="login--content__input-error-message__content"
              :name="idErrorMessage"
          >
            {{ errorMessage }}
          </div>

          <AicsTooltip
              :target="idErrorMessage"
              :isShow="showErrorMessageDots"
              placement="bottom-start"
              customClass="default default__login-error-message"
          >
            {{ errorMessage }}
          </AicsTooltip>
        </div>
      </div>
      <aics-button
          class="login--content__login-button"
          variant="primary"
          mode="filled"
          :id="idLogin"
          :text="$i18n.Button_Submit"
          :disabled="isDisabled"
          :is-width100-percent="true"
          @click="submitClick"
      />
      <div class="login--content__slot">
        <aics-button
            mode="text"
            :text="$i18n.Reset_Label_Back"
            @click="backToLogin"
        />
      </div>
    </div>
    <div class="login--footer">
      <img
          class="login--footer__img"
          :src="logoImg"
          alt=""
      />

      <div class="login--footer__content">
        <div class="login--footer__content--line1">
          <div class="text"> {{ footerData.webVersion }}</div>

          <AicsDivider class="login--footer__content--line1-divider-12" />

          <div class="text"> {{ footerData.serverVersion }}</div>

          <AicsDivider class="login--footer__content--line1-divider-12" />

          <AicsDropdown
              mode="text"
              size="12"
              variant="primary"
              :value="languageValue"
              :options="languageOptions"
              :allowEmpty="false"
              @change="languageChange"
          />
        </div>

        <div class="login--footer__content--line2">
          <div class="text"> {{ footerData.copyright }} </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login--content {
  gap: 24px;
  .login--content__title {
    margin-bottom: 0;
    color: #2B2B2B;
    font-size: 24px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px;
    height: 28px;
  }
  .login--content__input {
    margin-bottom: 0;
  }
  .login--content__slot {
    position: relative;
    top: unset;
  }
}
</style>
