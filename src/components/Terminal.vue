<template>
  <div>
    <div class="__content" ref="terminal">
      <TerminalMessage
        v-for="(message, index) in messages"
        :type="message.type"
        :key="index"
        >{{ message.text }}</TerminalMessage
      >
    </div>

    <b-input-group>
      <b-form-input
        placeholder="Enter command..."
        v-model="command"
        v-on:keyup.native.enter="sendCommand()"
        :disabled="!isConnected || !ready"
      ></b-form-input>
      <b-button
        @click="sendCommand()"
        variant="primary"
        :disabled="!isConnected || !ready"
        ><fa-icon icon="fa-solid fa-play" />&nbsp;Send</b-button
      >
      <b-button
        @click="scrollToBottom()"
        :pressed.sync="autoscroll"
        :disabled="!isConnected"
      >
        <fa-icon v-if="autoscroll" icon="fa-solid fa-lock" />
        <fa-icon v-if="!autoscroll" icon="fa-solid fa-lock-open" />
        &nbsp;Autoscroll</b-button
      >
    </b-input-group>
  </div>
</template>

<script lang="ts">
import { Commands } from '@/constants/Commands'
import { EventType } from '@/constants/types/EventType'
import TerminalMessage, {
  TerminalMessageType
} from '@/components/TerminalMessage.vue'
import eb from '@/EventBus'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Command, Message } from '@/store/communicationStore'
import { Component } from 'vue-property-decorator'

@Component({
  components: {
    TerminalMessage
  }
})
export default class Terminal extends ArmMixin {
  protected static readonly MAX_TERMINAL_MESSAGES = 50

  $refs!: {
    terminal: HTMLDivElement
  }

  messages: { text: string; type: TerminalMessageType }[] = []
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
    if (!this.$connectionStore.connected) return
    this.messages.push({
      text: message.replaceAll('BigRobotArm::', ''),
      type: send ? 'client' : 'server'
    })
    if (this.messages.length >= Terminal.MAX_TERMINAL_MESSAGES) {
      this.messages.shift()
    }

    this.scrollToBottom()
  }

  sendCommand() {
    if (!this.command.length) return

    this.sendCommandToArm(this.command)
    this.command = ''
  }

  scrollToBottom() {
    if (!this.$refs.terminal || !this.autoscroll) return

    const textarea = this.$refs.terminal
    setTimeout(() => (textarea.scrollTop = textarea.scrollHeight))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__content {
  height: 68vh;
  border-radius: 0.3rem 0.3rem 0 0;
  background-color: rgba(0, 0, 0, 0.03);
  flex-direction: column;
  overflow: scroll;
}

@media only screen and (max-width: 600px) {
  .__content {
    height: 25vh;
  }
}
</style>
