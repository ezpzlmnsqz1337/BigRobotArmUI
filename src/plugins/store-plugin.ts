import { ArmControlStore } from '@/store/armControlStore'
import { ConnectionStore } from '@/store/connectionStore'
import { SequencesStore } from '@/store/sequencesStore'
import { SerialCommStore } from '@/store/serialCommStore'
import _Vue, { PluginObject, PluginFunction } from 'vue'
import store, { AppStore } from '../store/store'

declare module 'vue/types/vue' {
  interface Vue {
    $store: AppStore
    $connectionStore: ConnectionStore
    $sequencesStore: SequencesStore
    $armControlStore: ArmControlStore
    $serialCommStore: SerialCommStore
  }
}

declare type StoreOptions = any

export interface StorePlugin extends PluginObject<StoreOptions> {
  install: PluginFunction<StoreOptions>
}

export const storePlugin: StorePlugin = {
  install(Vue: typeof _Vue) {
    Vue.prototype.$store = store
    Vue.prototype.$connectionStore = store.state.connectionStore
    Vue.prototype.$sequencesStore = store.state.sequencesStore
    Vue.prototype.$armControlStore = store.state.armControlStore
    Vue.prototype.$serialCommStore = store.state.serialCommStore
  }
}
