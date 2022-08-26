<template>
  <div>
    <b-row>
      <b-col class="my-auto controls">
        <RangeSliders valueName="speed" @on-change="sendCommand()" />
        <b-checkbox v-model="syncMotors" @change="sendSyncMotorsCommand()"
          >Sync motors</b-checkbox
        >
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Commands } from '@/constants/Commands'
import ArmMixin from '@/mixins/ArmMixin.vue'
import RangeSliders from '@/components/RangeSliders.vue'
import { Command } from '@/store'
import { Component } from 'vue-property-decorator'

@Component({
  components: {
    RangeSliders
  }
})
export default class Speed extends ArmMixin {
  get syncMotors() {
    return this.$armControlStore.arm.syncMotors
  }

  sendCommand() {
    const p = this.$armControlStore.getJointsAttribute('speed', 'value')
    const command: Command = `${Commands.SET_SPEEDS} B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist}`
    this.sendCommandToArm(command)
  }

  sendSyncMotorsCommand() {
    const sync = this.$armControlStore.arm.syncMotors ? 1 : 0
    const command: Command = `${Commands.SET_SYNC_MOTORS}${sync}`
    this.sendCommandToArm(command)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
