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
                :disabled="!ready"
              />
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-form-group>
          <b-button size="large" @click="setZeroPosition()" :disabled="!ready"
            >Set zero</b-button
          >
          <b-button size="large" @click="sendHomeCommand()" :disabled="!ready"
            >Home</b-button
          >
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Commands from '@/constants/Commands'
import arm from '@/mixins/arm.mixin'

export default {
  name: 'Position',
  mixins: [arm],
  methods: {
    sendCommand() {
      const p = this.$store.getJointsAttribute('target')
      const g = this.$arm.gripper.target
      const command = `${Commands.GO_TO} B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist} G${g}`
      this.sendCommandToArm(command)
    },
    sendHomeCommand() {
      const command = Commands.HOME
      this.$store.home()
      this.sendCommandToArm(command)
    },
    setZeroPosition() {
      const command = Commands.RESET_POSITION
      this.$store.home()
      this.sendCommandToArm(command)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
