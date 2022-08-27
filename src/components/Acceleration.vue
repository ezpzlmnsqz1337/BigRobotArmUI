<template>
  <div class="my-4">
    <b-row>
      <b-col class="my-auto controls">
        <RangeSliders valueName="acceleration" @on-change="sendCommand()" />
      </b-col>
    </b-row>
  </div>
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
    const acc = this.$armControlStore
      .getJoints()
      .map(x => `${x.code}${x.acceleration.value}`)
    const command = `${Commands.SET_ACCELERATIONS} ${acc.join(' ')}`
    this.sendCommandToArm(command)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
