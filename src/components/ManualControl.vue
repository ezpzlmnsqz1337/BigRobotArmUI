<template>
  <b-container fluid>
    <h2>Manual control</h2>
    <b-row>
      <b-col class="my-auto controls">
        <b-form-group v-for="j in [...joints, gripper]" :key="j.name">
          <label :for="j.name">{{ j.name }}</label>
          <b-row>
            <b-col md="12" lg="2">
              <b-form-input disabled :value="j.target" />
            </b-col>
            <b-col md="12" lg="10">
              <b-form-input
                :id="j.name"
                type="range"
                :name="j.name"
                v-model="j.target"
                @change="sendCommand()"
                :min="j.min"
                :max="j.max"
              />
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group>
          <b-button size="large" @click="setZeroPosition()">Set zero</b-button>
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
      joints: this.$arm.joints,
      gripper: this.$arm.gripper
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
  },
  methods: {
    sendCommand() {
      console.log('Pos: ', this.$store.getTargetPositions())
      const p = this.$store.getTargetPositions()
      const g = this.$arm.gripper.target
      const command = `G0 B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist} G${g}`
      this.$root.$emit('ws-message-send', command)
      if (ws) ws.send(command)
    },
    sendHomeCommand() {
      const command = 'G28'
      this.$root.$emit('ws-message-send', command)
      this.$store.home()
      if (ws) ws.send(command)
    },
    setZeroPosition() {
      const command = 'G92'
      this.$root.$emit('ws-message-send', command)
      this.$store.home()
      if (ws) ws.send(command)
    },
    handleMessage(message) {
      if (message.includes('B') && message.includes('S')) {
        message = message
          .split('\n')
          .filter(x => !x.includes('BigRobotArm'))
          .pop()
        if (message) {
          const positions = this.$store.parsePositionFromCommand(message[1])
          this.$store.setTargetPositions(positions)
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
