<template>
  <b-sidebar
    id="sidebar"
    shadow
    right
    @change="change()"
    :class="{ __fullscreen: fullscreen }"
  >
    <template #header="{ hide }">
      <div @click="toggleFullscreenMenu()">Big Robot Arm UI</div>
      <fa-icon icon="fa-solid fa-xmark" @click.prevent="hide()" />
      <div class="d-md-none __expand_arrows">
        <fa-icon
          @click="toggleFullscreenMenu()"
          :icon="`fa-solid fa-arrows-${fullscreen ? 'down' : 'up'}-to-line`"
        />
      </div>
    </template>
    <template #footer>
      <div class="d-flex justify-content-end px-3 py-3">
        <Connect v-if="!isConnected" />
        <b-button v-if="isConnected" variant="danger" @click="disconnect()"
          ><fa-icon icon="fa-solid fa-ban" />&nbsp;Disconnect</b-button
        >
      </div>
    </template>
    <b-tabs pills fill card>
      <b-tab class="mt-3">
        <template #title>
          <fa-icon icon="fa-solid fa-gamepad" />
        </template>
        <ManualControl />
      </b-tab>
      <b-tab class="mt-3">
        <template #title>
          <fa-icon icon="fa-solid fa-sliders" />
        </template>
        <Sequences />
      </b-tab>
      <b-tab class="mt-3">
        <template #title>
          <fa-icon icon="fa-solid fa-square-plus" />
        </template>
        <RecordCommands />
      </b-tab>
      <b-tab class="mt-3">
        <template #title>
          <fa-icon icon="fa-solid fa-terminal" />
        </template>
        <b-card-text><Terminal /></b-card-text>
      </b-tab>
    </b-tabs>
  </b-sidebar>
</template>

<script lang="ts">
import ManualControl from '@/components/ManualControl.vue'
import RecordCommands from '@/components/RecordCommands.vue'
import Sequences from '@/components/Sequences.vue'
import Terminal from '@/components/Terminal.vue'
import { Component, Emit, Vue } from 'vue-property-decorator'
import Connect from './Connect.vue'

@Component({
  components: {
    ManualControl,
    Terminal,
    Sequences,
    RecordCommands,
    Connect
  }
})
export default class Sidebar extends Vue {
  @Emit('change')
  change() {}

  fullscreen = false

  get isConnected() {
    return this.$connectionStore.connected
  }

  disconnect() {
    this.$connectionStore.setConnectionStatus(false)
    this.$communicationStore.disconnect()
  }

  toggleFullscreenMenu() {
    this.fullscreen = !this.fullscreen
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
:deep(.b-sidebar > .b-sidebar-header) {
  justify-content: space-between;
}

@media only screen and (max-width: 768px) {
  :host.__shrink {
    height: 40vh;
  }

  :deep(.b-sidebar) {
    position: fixed;
    width: 100% !important;
    height: calc(100% - 40vh);
    left: 0;
    right: 0;
    top: 0;
  }

  .__fullscreen :deep(.b-sidebar) {
    height: calc(100%);
  }

  :deep(.b-sidebar) {
    transform: translateY(40vh);
  }

  .__fullscreen :deep(.b-sidebar) {
    transform: translateY(0vh);
  }

  :deep(.b-sidebar.slide) {
    transition: transform 0.3s ease-in-out;
  }

  :deep(.b-sidebar.b-sidebar-right.slide:not(.show)) {
    transform: translateY(100vh);
  }

  .__expand_arrows {
    position: absolute;
    height: 0;
    width: calc(100% - 2rem);
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
