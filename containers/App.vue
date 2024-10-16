<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { AppMixin } from '@/SRPFramework'

@Component({
  components: {
    AppMixin,
  },
})
export default class App extends Vue {

}
</script>

<template>
  <div id="app">
    <router-view />
    <app-mixin />
  </div>
</template>

<style scoped lang="scss">
#app {
  font-family: 'Roboto', serif;
}
</style>