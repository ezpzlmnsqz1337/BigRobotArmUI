<template>
  <div>
    <b-row>
      <b-col class="my-auto controls">
        <RangeSliders valueName="acceleration" @on-change="sendCommand()" />
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import RangeSliders from '@/components/RangeSliders.vue'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Component } from 'vue-property-decorator'

@Component({
  components: {
    RangeSliders
  }
})
export default class Acceleration extends ArmMixin {
  sendCommand() {
    const command = this.$armControlStore.createAccelerationCommand()
    this.sendCommandToArm(command)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
