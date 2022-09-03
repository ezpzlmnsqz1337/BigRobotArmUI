<template>
  <div>
    <b-row>
      <b-col class="my-auto controls">
        <RangeSliders valueName="speed" @on-change="sendCommand()" />
        <b-checkbox
          v-model="$armControlStore.arm.syncMotors"
          size="lg"
          @change="sendSyncMotorsCommand()"
          :disabled="!isConnected || !ready"
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
import { Command } from '@/store/communicationStore'
import { Component } from 'vue-property-decorator'

@Component({
  components: {
    RangeSliders
  }
})
export default class Speed extends ArmMixin {
  sendCommand() {
    const s = this.$armControlStore
      .getJoints()
      .map(x => `${x.code}${x.speed.value}`)
    const command: Command = `${Commands.SET_SPEEDS} ${s.join(' ')}`
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
