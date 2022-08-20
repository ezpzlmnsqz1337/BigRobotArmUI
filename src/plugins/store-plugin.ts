import _Vue, { PluginObject, PluginFunction } from 'vue'
import store, { AppStore, RobotArmData } from '../store'

declare module 'vue/types/vue' {
  interface Vue {
    $store: AppStore
    $arm: RobotArmData
  }
}

declare type StoreOptions = any

export interface StorePlugin extends PluginObject<StoreOptions> {
  install: PluginFunction<StoreOptions>
}

export const storePlugin: StorePlugin = {
  install(Vue: typeof _Vue) {
    Vue.prototype.$store = store
    Vue.prototype.$arm = store.state.arm
  }
}
