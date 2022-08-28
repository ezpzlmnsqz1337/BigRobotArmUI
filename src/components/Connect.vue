<template>
  <b-button variant="success" @click="connect()" :disabled="isConnecting">
    <fa-icon v-if="isConnecting" icon="fa-solid fa-circle-notch" spin />
    <fa-icon
      v-if="!isConnecting"
      icon="fa-solid fa-plug"
    />&nbsp;Connect</b-button
  >
</template>

<script lang="ts">
import { SerialMessage } from '@/constants/SerialMessage'
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Connect extends Vue {
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
      if (connectionStatus) {
        this.$connectionStore.stopConnecting()
      }
    }
  }

  connect() {
    this.$connectionStore.startConnecting()
    setTimeout(() => this.$communicationStore.connect())
  }
}
</script>

<style scoped lang="scss"></style>
