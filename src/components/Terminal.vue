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
          <b-button @click="sendCommand()" :disabled="disabled">Send</b-button>
          <b-button @click="scrollToBottom()" :pressed.sync="autoscroll"
            >Autoscroll</b-button
          >
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ws from '@/shared'

export default {
  name: 'Terminal',
  data() {
    return {
      disabled: true,
      serialOutput: '',
      command: '',
      autoscroll: true
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
    this.$root.$on('ws-message-send', e => this.addMessage(e))
  },
  methods: {
    addMessage(message, send = true) {
      message = send ? `Send:\n${message}\n` : `Receive:\n${message}\n`
      this.serialOutput += message
      if (this.autoscroll) {
        const textarea = this.$refs.terminal.$el
        setTimeout(() => (textarea.scrollTop = textarea.scrollHeight))
      }
      if (send) {
        this.disabled = true
      }
    },
    sendCommand() {
      if (!this.command.length) return

      if(ws) ws.send(`${this.command}\r`)
      this.addMessage(this.command)
      this.command = ''
      this.disabled = true
    },
    handleMessage(message) {
      if (message.includes('READY')) this.disabled = false
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
