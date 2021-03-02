<template>
  <b-container fluid>
    <b-row>
      <b-col class="my-auto controls">
        <b-form-group v-for="j in joints" :key="j.name">
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
import eb from '@/EventBus'
import EventType from '@/constants/types/EventType'

export default {
  name: 'Position',
  data() {
    return {
      joints: this.$arm.joints
    }
  },
  methods: {
    sendCommand() {
      console.log('Speeds: ', this.$store.getJointsAttribute('target'))
      const p = this.$store.getJointsAttribute('target')
      const g = this.$arm.gripper.target
      const command = `G0 B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist} G${g}`
      eb.emit(EventType.WS_MESSAGE_SEND, command)
      if (ws) ws.send(command)
    },
    sendHomeCommand() {
      const command = 'G28'
      eb.emit(EventType.WS_MESSAGE_SEND, command)
      this.$store.home()
      if (ws) ws.send(command)
    },
    setZeroPosition() {
      const command = 'G92'
      eb.emit(EventType.WS_MESSAGE_SEND, command)
      this.$store.home()
      if (ws) ws.send(command)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
