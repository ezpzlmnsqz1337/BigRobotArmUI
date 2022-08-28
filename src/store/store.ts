import Vue from 'vue'
import { ArmControlStore, armControlStore } from './armControlStore'
import { ConnectionStore, connectionStore } from './connectionStore'
import { SequencesStore, sequencesStore } from './sequencesStore'
import { CommunicationStore, communicationStore } from './communicationStore'

export interface AppStore {
  state: StoreState
}

export interface StoreState {
  connectionStore: ConnectionStore
  armControlStore: ArmControlStore
  communicationStore: CommunicationStore
  sequencesStore: SequencesStore
}

const state: StoreState = {
  sequencesStore,
  connectionStore,
  armControlStore,
  communicationStore
}

const store: AppStore = Vue.observable({
  state
})

export default store
