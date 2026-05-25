import Vue from 'vue'
import { ArmControlStore, armControlStore } from './armControlStore'
import { ConnectionStore, connectionStore } from './connectionStore'
import { JobStore, jobStore } from './jobStore'
import { SequencesStore, sequencesStore } from './sequencesStore'
import { CommunicationStore, communicationStore } from './communicationStore'

export interface AppStore {
  state: StoreState
}

export interface StoreState {
  connectionStore: ConnectionStore
  jobStore: JobStore
  armControlStore: ArmControlStore
  communicationStore: CommunicationStore
  sequencesStore: SequencesStore
}

const state: StoreState = {
  sequencesStore,
  connectionStore,
  jobStore,
  armControlStore,
  communicationStore
}

const store: AppStore = Vue.observable({
  state
})

export default store
