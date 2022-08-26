<template>
  <b-container fluid>
    <b-row>
      <b-col class="my-auto controls">
        <RangeSliders valueName="acceleration" @on-change="sendCommand()" />
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
export default class Acceleration extends ArmMixin {
  sendCommand() {
    const p = this.$armControlStore.getJointsAttribute('acceleration', 'value')
    const command = `${Commands.SET_ACCELERATIONS} B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist}`
    this.sendCommandToArm(command)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
