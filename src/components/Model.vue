<template>
  <div ref="armWrapper" class="__armWrapper" />
</template>

<script lang="ts">
import { EventType } from '@/constants/types/EventType'
import { Arm } from '@/helpers/Arm'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Model extends ArmMixin {
  $refs!: {
    armWrapper: HTMLDivElement
  }
  arm!: Arm

  created() {
    window.addEventListener(EventType.WINDOW_RESIZE, this.handleResize, false)
    this.$sequencesStore.initSequences()
  }

  mounted() {
    setTimeout(() => this.setupModel(), 500)
  }

  handleResize() {
    if (this.arm) this.arm.handleResize()
  }

  setupModel() {
    const armWrapper = this.$refs.armWrapper
    this.arm = new Arm(armWrapper, this.$armControlStore.arm)
    this.arm.init()
  }

  destroyed() {
    window.removeEventListener(EventType.WINDOW_RESIZE, this.handleResize)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__armWrapper {
  z-index: -999;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
