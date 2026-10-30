<template>
  <div class="__armWrapper">
    <div ref="armWrapper" class="__armWrapper" />
    <div class="__loadingModel" v-if="loadingModel || loadError">
      <template v-if="loadError">
        <div>Failed to load the arm model</div>
        <div class="__error">{{ loadError }}</div>
      </template>
      <template v-else>
        <div v-if="loadedMB < totalMB">Loading model</div>
        <div v-if="loadedMB < totalMB">{{ loadedMB }} / {{ totalMB }} MB</div>
        <div v-if="message && loadedMB >= totalMB">{{ message }}</div>
        <fa-icon icon="fa-solid fa-circle-notch" spin class="mt-3" />
      </template>
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
  loadError = ''
  message = ''
  loadedMB = 0
  totalMB = 0
  arm!: Arm
  setupTimeout: ReturnType<typeof setTimeout> | null = null

  $refs!: {
    armWrapper: HTMLDivElement
  }

  readonly handleResize = () => {
    if (this.arm) this.arm.handleResize()
  }

  readonly handleModelLoaded = () => {
    this.loadError = ''
    this.loadingModel = false
  }

  readonly handleLoadingMessage = (message: string) => {
    this.loadError = ''
    this.loadingModel = true
    this.message = message
  }

  readonly handleLoadingProgress = (event: ProgressEvent) => {
    this.loadedMB = Number((event.loaded / 1000000).toFixed(2))
    this.totalMB = Number((event.total / 1000000).toFixed(2))
  }

  readonly handleModelError = (error: unknown) => {
    const detail =
      error instanceof Error
        ? error.message
        : (error as ErrorEvent | undefined)?.message ?? ''
    this.loadError =
      detail || 'Check your network connection and reload the page.'
    this.loadingModel = false
  }

  created() {
    window.addEventListener(EventType.WINDOW_RESIZE, this.handleResize, false)
    eb.on(EventType.ARM_MODEL_LOADED, this.handleModelLoaded)
    eb.on(EventType.ARM_MODEL_LOADING_MESSAGE, this.handleLoadingMessage)
    eb.on(EventType.ARM_MODEL_LOADING_PROGRESS, this.handleLoadingProgress)
    eb.on(EventType.ARM_MODEL_LOADED_ERROR, this.handleModelError)
    this.$sequencesStore.initSequences()
  }

  mounted() {
    this.setupTimeout = setTimeout(() => this.setupModel(), 500)
  }

  setupModel() {
    const armWrapper = this.$refs.armWrapper
    this.arm = new Arm(armWrapper, this.$armControlStore.arm)
    this.arm.init()
  }

  destroyed() {
    if (this.setupTimeout !== null) clearTimeout(this.setupTimeout)
    window.removeEventListener(EventType.WINDOW_RESIZE, this.handleResize)
    eb.off(EventType.ARM_MODEL_LOADED, this.handleModelLoaded)
    eb.off(EventType.ARM_MODEL_LOADING_MESSAGE, this.handleLoadingMessage)
    eb.off(EventType.ARM_MODEL_LOADING_PROGRESS, this.handleLoadingProgress)
    eb.off(EventType.ARM_MODEL_LOADED_ERROR, this.handleModelError)
    this.arm?.dispose()
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
  text-align: center;
  padding: 1rem;

  .__error {
    font-size: 1rem;
    color: #dc3545;
  }

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
