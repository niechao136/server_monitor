<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { AicsLayoutBody, AicsLayoutHeader, AicsLayoutNav, LayoutNavModel, UserControlNavModel } from '@/../components'
import { HeaderTitle } from '@/SRPFramework'
import { jumpToTitle, startLoading, stopLoading } from '@/SRPFramework/stores'
import { LoginStore } from '@/stores'
import { NavListOriginal, VERSION } from '@/config'


const loginStore = new LoginStore()
const { getOwner, getAccList, getVersion, changeAcc, logout } = loginStore
@Component({
  components: {
    AicsLayoutBody,
    AicsLayoutHeader,
    AicsLayoutNav,
  }
})
export default class Layout extends Mixins(HeaderTitle) {
  //#region Brand

  protected home_href = '/overview'
  public get brand_id() {
    return this.$i18n.Common_BrandId.replace('{0}', loginStore.current_acc?.id ?? '')
  }
  private brand_value: LayoutNavModel.IBlandOption = null
  protected get brand_options(): LayoutNavModel.IBlandOption[] {
    return loginStore.acc_list.map(o => {
      return { key: o.id, value: o.name }
    })
  }
  private body_refresh = true
  protected async brandChange(value: LayoutNavModel.IBlandOption) {
    if (value.key !== this.brand_value.key) {
      startLoading('change')
      const res = await changeAcc(String(value.key))
      if (res?.status === 1) {
        this.body_refresh = false
        await getOwner()
        this.initAcc()
        jumpToTitle()
        setTimeout(() => {
          this.body_refresh = true
          setTimeout(() => {
            stopLoading('change')
          }, 200)
        })
      } else {
        stopLoading('change')
      }
    }
  }
  private initAcc() {
    this.brand_value = {
      key: loginStore.current_acc?.id ?? '',
      value: loginStore.current_acc?.name ?? '',
    }
  }
  //#endregion
  //#region Nav

  protected get nav_list(): LayoutNavModel.IList[] {
    return NavListOriginal.map(nav => {
      return {
        ...nav,
        title: this.$i18n[nav.titleI18nKey],
      }
    })
  }
  private last_route = this.$route.path
  protected pathChange(path: string) {
    this.$nextTick(() => {
      if (path === this.last_route) {
        jumpToTitle()
      }
      this.last_route = this.$route.path
    })
  }
  //#endregion
  //#region User

  protected get user_name() {
    return loginStore.owner?.fullname ?? ''
  }
  protected get user_role() {
    return this.$i18n['role_' + loginStore.owner?.roleid] ?? this.$i18n.role_3
  }
  protected user_action: UserControlNavModel.IAction[] = [
    this.$i18n.Common_changePassword,
    this.$i18n.logout,
  ]
  protected get user_footer(): UserControlNavModel.IFooter {
    return {
      serverVersion: loginStore.version,
      webVersion: VERSION,
    }
  }
  protected async userActionClick(_: string, index: number) {
    switch (index) {
      case 0:
        await this.$router.push('/resetpwd')
        break
      case 1:
        await logout()
        await this.$router.push('/login')
        break
    }
  }
  //#endregion
  //#region Init

  protected async created() {
    startLoading('layout')
    await getVersion()
    await getOwner()
    await getAccList()
    this.initAcc()
    stopLoading('layout')
  }
  //#endregion
}
</script>

<template>
  <div class="layout">
    <aics-layout-header
        :breadcrumbs="breadcrumbs"
        :is-show-back="show_back"
        :title="title"
        @backClick="backClick"
        @breadcrumbClick="breadcrumbClick"
    />

    <aics-layout-body ref="layoutBody" v-if="body_refresh">
      <keep-alive>
        <router-view/>
      </keep-alive>
    </aics-layout-body>

    <aics-layout-nav
        ref="setting_nav"
        :brand-id="brand_id"
        :brand-options="brand_options"
        :brand-value="brand_value"
        :home-href="home_href"
        :is-show-brand="true"
        :logo-subtitle="''"
        :nav-list="nav_list"
        :user-actions="user_action"
        :user-footer="user_footer"
        :user-name="user_name"
        :user-rule="user_role"
        @brandChange="brandChange"
        @pathChange="pathChange"
        @userActionClick="userActionClick"
    />
  </div>
</template>

<style scoped lang="scss">
.nav {
  ::v-deep {
    .nav--logo__logo_box {
      height: 62px!important;
      img {
        height: 36px!important;
        width: 129px!important;
        margin: 20px 0 6px 32px;
      }
    }
    .nav--logo__subtitle {
      margin-left: 32px!important;
    }
  }
}
</style>
