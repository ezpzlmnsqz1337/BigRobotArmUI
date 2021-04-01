<template>
  <b-container fluid>
    <h2>Terminal</h2>
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
          <b-button @click="sendCommand()" :disabled="!ready">Send</b-button>
          <b-button @click="scrollToBottom()" :pressed.sync="autoscroll"
            >Autoscroll</b-button
          >
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import eb from '@/EventBus'
import EventType from '@/constants/types/EventType'
import arm from '@/mixins/arm.mixin'

export default {
  name: 'Terminal',
  mixins: [arm],
  data() {
    return {
      serialOutput: '',
      command: '',
      autoscroll: true
    }
  },
  created: function() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, e => this.handleMessage(e))
    eb.on(EventType.WS_MESSAGE_SEND, e => this.addMessage(e))
  },
  methods: {
    addMessage(message, send = true) {
      message = send ? `Send:\n${message}\n` : `Receive:\n${message}\n`
      this.serialOutput += message
      if (this.autoscroll) {
        const textarea = this.$refs.terminal.$el
        setTimeout(() => (textarea.scrollTop = textarea.scrollHeight))
      }
    },
    sendCommand() {
      if (!this.command.length) return

      this.sendCommandToArm(this.command)
      this.command = ''
    },
    handleMessage(message) {
      this.addMessage(message, false)
    },
    scrollToBottom() {
      if (this.autoscroll) {
        const textarea = this.$refs.terminal.$el
        setTimeout(() => (textarea.scrollTop = textarea.scrollHeight))
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__serialOutput {
  height: 15rem;
}
</style>
