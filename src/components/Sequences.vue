<template>
  <b-container fluid>
    <h2>Sequences</h2>
    <b-row>
      <b-col class="my-auto controls">
        <b-textarea v-model="serialOutput" class="__serialOutput"></b-textarea>
        <b-input-group>
          <b-form-input
            placeholder="Enter command..."
            v-model="command"
          ></b-form-input>
          <b-button @click="sendCommand()">Send</b-button>
        </b-input-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ws from '@/shared'

export default {
  name: 'Sequences',
  data() {
    return {
      files: [],
      command: ''
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
  },
  methods: {
    sendCommand() {
      if (!this.command.length) return

      ws.send(`${this.command}\r`)
      this.serialOutput += `Send: ${this.command}\n`
      this.command = ''
    },
    handleMessage(message) {
      this.serialOutput += `Receive: ${message}\n`
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
