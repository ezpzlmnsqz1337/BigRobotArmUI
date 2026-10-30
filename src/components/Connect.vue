<template>
  <div>
    <b-alert v-if="error" show variant="danger" class="text-left py-2">
      {{ error }}
    </b-alert>
    <b-button variant="success" @click="connect()" :disabled="isConnecting">
      <fa-icon v-if="isConnecting" icon="fa-solid fa-circle-notch" spin />
      <fa-icon
        v-if="!isConnecting"
        icon="fa-solid fa-plug"
      />&nbsp;Connect</b-button
    >
  </div>
</template>

<script lang="ts">
import { SerialMessage } from '@/constants/SerialMessage'
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Connect extends Vue {
  readonly handleWebSocketMessage = (message: string) =>
    this.handleMessage(message)

  get isConnecting() {
    return this.$connectionStore.isConnecting
  }

  get error() {
    return this.$connectionStore.error
  }

  created() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, this.handleWebSocketMessage)
  }

  destroyed() {
    eb.off(EventType.WS_MESSAGE_RECEIVED, this.handleWebSocketMessage)
  }

  handleMessage(message: string) {
    if (!message.includes(SerialMessage.CONNECTION_STATUS)) return

    const connectionStatus = parseInt(message.split(':')[1], 10) === 1
    this.$connectionStore.setConnectionStatus(connectionStatus)
    this.$connectionStore.stopConnecting()
  }

  connect() {
    this.$connectionStore.startConnecting()
    this.$communicationStore.connect()
  }
}
</script>

<style scoped lang="scss"></style>
