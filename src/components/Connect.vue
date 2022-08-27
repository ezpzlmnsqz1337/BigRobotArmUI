<template>
  <b-card
    v-show="!isConnected"
    header="Big Robot Arm UI"
    class="text-center mx-auto mt-4"
    style="max-width: 50vw;"
  >
    <b-button variant="success" @click="connect()" :disabled="isConnecting">
      <fa-icon v-if="isConnecting" icon="fa-solid fa-circle-notch" spin />
      <fa-icon
        v-if="!isConnecting"
        icon="fa-solid fa-plug"
      />&nbsp;Connect</b-button
    >
  </b-card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Commands } from '@/constants/Commands'
import { WebsocketMessage } from '@/constants/WebsocketMessage'
import ws from '@/shared'
import { SerialMessage } from '@/constants/SerialMessage'
import eb from '@/EventBus'
import { EventType } from '@/constants/types/EventType'

@Component
export default class Connect extends Vue {
  get isConnected() {
    return this.$connectionStore.connected
  }

  get isConnecting() {
    return this.$connectionStore.isConnecting
  }

  created() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, message => this.handleMessage(message))
  }

  handleMessage(message: string) {
    if (message.includes(SerialMessage.CONNECTION_STATUS)) {
      const connectionStatus = parseInt(message.split(':')[1]) === 1
      this.$connectionStore.setConnectionStatus(connectionStatus)
      this.$connectionStore.stopConnecting()
    }
  }

  connect() {
    this.$connectionStore.startConnecting()
    ws.send(WebsocketMessage.WS_CONNECT)
    ws.send(Commands.STATUS)
  }
}
</script>

<style scoped lang="scss"></style>
