<template>
  <b-container fluid>
    <h2>Manual control</h2>
    <b-row>
      <b-col class="my-auto controls">
        <b-form-group>
          <label for="base">Base</label>
          <b-form-input
            id="base"
            type="range"
            name="base"
            v-model="base"
            @change="sendCommand()"
            min="-6500"
            max="6500"
          />
          <label for="shoulder">Shoulder</label>
          <b-form-input
            id="shoulder"
            type="range"
            name="shoulder"
            v-model="shoulder"
            @change="sendCommand()"
            min="-10000"
            max="10000"
          />
          <label for="elbow">Elbow</label>
          <b-form-input
            id="elbow"
            type="range"
            name="elbow"
            v-model="elbow"
            @change="sendCommand()"
            min="-20500"
            max="20500"
          />
          <label for="wristRotate">Wrist Rotate</label>
          <b-form-input
            id="wristRotate"
            type="range"
            name="wristRotate"
            v-model="wristRotate"
            @change="sendCommand()"
            min="-800"
            max="800"
          />
          <label for="wrist">Wrist</label>
          <b-form-input
            id="wrist"
            type="range"
            name="wrist"
            v-model="wrist"
            @change="sendCommand()"
            min="-3000"
            max="3000"
          />
          <label for="gripper">Gripper</label>
          <b-form-input
            id="gripper"
            type="range"
            name="gripper"
            v-model="gripper"
            @change="sendCommand()"
            min="0"
            max="180"
          />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group>
          <b-button size="large" @click="sendHomeCommand()">Home</b-button>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ws from '@/shared'

export default {
  name: 'ManualControl',
  data() {
    return {
      base: 0,
      shoulder: 0,
      elbow: 0,
      wristRotate: 0,
      wrist: 0,
      gripper: 0
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
  },
  methods: {
    sendCommand() {
      const command = `G0 B${this.base} S${this.shoulder} E${this.elbow} WR${this.wristRotate} W${this.wrist} G${this.gripper}`
      this.$root.$emit('ws-message-send', command)
      ws.send(command)
    },
    sendHomeCommand() {
      const command = 'G28'
      this.$root.$emit('ws-message-send', command)
      ws.send(command)
    },
    handleMessage(message) {
      if (message.includes('B:') && message.includes('S:')) {
        message = message.split(' ')
        this.base = parseInt(message[1])
        this.shoulder = parseInt(message[3])
        this.elbow = parseInt(message[5])
        this.wristRotate = parseInt(message[7])
        this.wrist = parseInt(message[9])
        this.gripper = parseInt(message[11])
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
