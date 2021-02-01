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
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ws from '@/shared'
import { debounce } from 'vue-debounce'

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
    debounceSendCommand() {
      return debounce(() => {
        this.sendCommand()
      }, 300)
    },
    sendCommand() {
      ws.send(
        `G0 X${this.base} Y${this.shoulder} Z${this.elbow} E${this.wristRotate} F${this.wrist}`
      )
    },
    handleMessage(message) {
      if (message.includes('armPositions')) {
        this.base = parseInt(message.split(':')[2])
        this.shoulder = parseInt(message.split(':')[4])
        this.elbow = parseInt(message.split(':')[6])
        this.wristRotate = parseInt(message.split(':')[8])
        this.wrist = parseInt(message.split(':')[10])
        this.gripper = parseInt(message.split(':')[12])
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
