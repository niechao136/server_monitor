<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { SrpTable, TableModel } from '@/SRPFramework'
import { startLoading, stopLoading } from '@/SRPFramework/stores'
import { post } from '@/api'

@Component({})
export default class key extends Vue {
  //#region List

  private table_data: Key.Info[] = []
  private table_option: TableModel.IColumn[] = [
    {
      type: 'checkbox',
      isDisabledKey: '',
      optionKey: '',
      valueKey: '',
    }
  ]
  //#endregion
  //#region Init

  protected async activated() {
    startLoading('layout')
    const res = await post<Result.KeyList>({ url: 'key/list' })
    stopLoading('layout')
  }
  //#endregion
}
</script>

<template>

</template>

<style scoped lang="scss">

</style>