<template>
  <b-container fluid>
    <b-row>
      <b-col class="my-auto controls">
        <b-textarea
          readonly
          v-model="serialOutput"
          class="__serialOutput"
          ref="terminal"
        ></b-textarea>
        <b-input-group>
          <b-form-input
            placeholder="Enter command..."
            v-model="command"
            v-on:keyup.native.enter="sendCommand()"
          ></b-form-input>
          <b-button @click="sendCommand()" variant="primary" :disabled="!ready"
            ><b-icon icon="play-fill"></b-icon>Send</b-button
          >
          <b-button @click="scrollToBottom()" :pressed.sync="autoscroll"
            ><b-icon v-if="autoscroll" icon="lock-fill"></b-icon>
            <b-icon v-if="!autoscroll" icon="unlock-fill"></b-icon
            >Autoscroll</b-button
          >
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Commands } from '@/constants/Commands'
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Command, Message } from '@/store'
import { BFormTextarea } from 'bootstrap-vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Terminal extends ArmMixin {
  $refs!: {
    terminal: BFormTextarea
  }

  serialOutput = ''
  command: Command = ''
  autoscroll = true
  initialized = false

  created() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, e => this.addMessage(e, false))
    eb.on(EventType.WS_MESSAGE_SEND, e => this.addMessage(e))
  }

  mounted() {
    if (!this.initialized) this.sendCommandToArm(Commands.STATUS)
    this.initialized = true
  }

  addMessage(message: Message, send = true) {
    if (!this.$store.state.connected) return
    message = send ? `Send:\n${message}\n` : `Receive:\n${message}\n`
    this.serialOutput += message
    this.scrollToBottom()
  }

  sendCommand() {
    if (!this.command.length) return

    this.sendCommandToArm(this.command)
    this.command = ''
  }

  scrollToBottom() {
    if (!this.$refs.terminal || !this.autoscroll) return

    const textarea = this.$refs.terminal.$el
    setTimeout(() => (textarea.scrollTop = textarea.scrollHeight))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__serialOutput {
  height: 15rem;
}
</style>
