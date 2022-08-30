<template>
  <div class="__armWrapper">
    <div ref="armWrapper" class="__armWrapper" />
    <div class="__loadingModel" v-if="loadingModel">
      <div v-if="loadedMB < totalMB">Loading model</div>
      <div v-if="loadedMB < totalMB">{{ loadedMB }} / {{ totalMB }} MB</div>
      <div v-if="message && loadedMB >= totalMB">{{ message }}</div>
      <fa-icon icon="fa-solid fa-circle-notch" spin class="mt-3" />
    </div>
  </div>
</template>

<script lang="ts">
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import { Arm } from '@/helpers/Arm'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Model extends ArmMixin {
  loadingModel = true
  message = ''
  loadedMB = 0
  totalMB = 0
  arm!: Arm

  $refs!: {
    armWrapper: HTMLDivElement
  }

  created() {
    window.addEventListener(EventType.WINDOW_RESIZE, this.handleResize, false)
    eb.on(EventType.ARM_MODEL_LOADED, () => (this.loadingModel = false))
    eb.on(EventType.ARM_MODEL_LOADING_MESSAGE, e => {
      this.loadingModel = true
      this.message = e
    })
    eb.on(EventType.ARM_MODEL_LOADING_PROGRESS, (e: ProgressEvent) => {
      this.loadedMB = Number((e.loaded / 1000000).toFixed(2))
      this.totalMB = Number((e.total / 1000000).toFixed(2))
    })
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
.__loadingModel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #e8e8e8;
  font-size: 1.5rem;

  svg {
    font-size: 4rem;
  }
}

.__armWrapper,
.__loadingModel {
  z-index: -999;
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
