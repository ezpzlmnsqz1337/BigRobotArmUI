import Vue from 'vue'
import { ArmControlStore, armControlStore } from './armControlStore'
import { ConnectionStore, connectionStore } from './connectionStore'
import { SequencesStore, sequencesStore } from './sequencesStore'
import { SerialCommStore, serialCommStore } from './serialCommStore'

export interface AppStore {
  state: StoreState
}

export interface StoreState {
  connectionStore: ConnectionStore
  armControlStore: ArmControlStore
  serialCommStore: SerialCommStore
  sequencesStore: SequencesStore
}

const state: StoreState = {
  sequencesStore,
  connectionStore,
  armControlStore,
  serialCommStore
}

const store: AppStore = Vue.observable({
  state
})

export default store
