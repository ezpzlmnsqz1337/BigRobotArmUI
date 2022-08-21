<template>
  <b-container fluid>
    <b-row>
      <b-col class="my-auto controls">
        <RangeSliders
          valueName="position"
          valueKey="target"
          @on-change="sendCommand()"
        />
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

<script lang="ts">
import { Commands } from '@/constants/Commands'
import ArmMixin from '@/mixins/ArmMixin.vue'
import RangeSliders from '@/components/RangeSliders.vue'
import { Component } from 'vue-property-decorator'

@Component({
  components: {
    RangeSliders
  }
})
export default class Position extends ArmMixin {
  sendCommand() {
    const p = this.$store.getJointsAttribute('position', 'target')
    console.log(p)
    const command = `${Commands.GO_TO} B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist}`
    this.sendCommandToArm(command)
  }

  sendHomeCommand() {
    const command = Commands.HOME
    this.$store.home()
    this.sendCommandToArm(command)
  }

  setZeroPosition() {
    const command = Commands.RESET_POSITION
    this.$store.home()
    this.sendCommandToArm(command)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
