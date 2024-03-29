<template>
  <b-container fluid class="text-center my-auto">
    <div class="__model" :class="{ __shrink: menuOpen }">
      <Model ref="model" />
      <Sidebar @change="menuOpen ? closeMenu() : openMenu()" />

      <div v-if="!loadingModel" class="__menu">
        <b-button
          size="lg"
          @click="toggleAntialias()"
          :variant="antialiasing ? 'primary' : 'secondary'"
        >
          <fa-icon icon="fa-solid fa-a" />
        </b-button>
        <b-button v-b-toggle.sidebar size="lg">
          <fa-icon icon="fa-solid fa-bars" />
        </b-button>
      </div>

      <div v-if="!loadingModel" class="__controls">
        <b-button size="lg" @click="resetCamera()">
          <fa-icon icon="fa-solid fa-crosshairs" />
        </b-button>
        <b-button
          size="lg"
          :disabled="!isConnected"
          @click="toggleGripper()"
          :variant="gripper.enabled ? 'primary' : 'secondary'"
        >
          <fa-icon
            :icon="
              `fa-solid fa-${gripper.enabled ? 'square-plus' : 'square-minus'}`
            "
          />
        </b-button>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import Model from '@/components/Model.vue'
import Sidebar from '@/components/Sidebar.vue'
import { SerialMessage } from '@/constants/SerialMessage'
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Component } from 'vue-property-decorator'

@Component({
  components: {
    Model,
    Sidebar
  }
})
export default class Main extends ArmMixin {
  $refs!: {
    model: Model
  }

  antialiasing = true
  menuOpen = false
  loadingModel = true

  created() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, message => this.handleMessage(message))
    eb.on(EventType.ARM_MODEL_LOADED, () => (this.loadingModel = false))
  }

  handleMessage(message: string) {
    console.log('Response from server: ', message)

    if (message.includes(SerialMessage.READY)) this.$armControlStore.ready()
    if (message.includes(SerialMessage.POSITION)) this.handlePositions(message)
    if (message.includes(SerialMessage.GRIPPER)) this.handleGripper(message)
    if (message.includes(SerialMessage.SPEED)) this.handleSpeed(message)
    if (message.includes(SerialMessage.ACCELERATION))
      this.handleAcceleration(message)
    if (message.includes(SerialMessage.SYNC_MOTORS))
      this.handleSyncMotors(message)
  }

  handlePositions(message: string) {
    const positions = this.$communicationStore.parseJointsData(
      message,
      SerialMessage.POSITION
    )
    if (!positions) return
    this.$armControlStore.setValuePositions(positions)
    this.$armControlStore.setTargetPositions(positions)
  }

  handleSpeed(message: string) {
    const speeds = this.$communicationStore.parseJointsData(
      message,
      SerialMessage.SPEED
    )
    if (!speeds) return
    this.$armControlStore.setSpeeds(speeds)
  }

  handleAcceleration(message: string) {
    const accelerations = this.$communicationStore.parseJointsData(
      message,
      SerialMessage.ACCELERATION
    )
    if (!accelerations) return
    this.$armControlStore.setAccelerations(accelerations)
  }

  handleGripper(message: string) {
    const gripper = this.$communicationStore.parseGripper(message)
    if (!gripper) return
    this.$armControlStore.setGripperEnabled(gripper.enabled)
    this.$armControlStore.setGripperTargetPosition(gripper.target)
    this.$armControlStore.setGripperValuePosition(gripper.target)
  }

  handleSyncMotors(message: string) {
    const syncMotors = this.$communicationStore.parseSyncMotors(message)
    if (!syncMotors) return
    this.$armControlStore.setSyncMotors(syncMotors)
  }

  toggleGripper() {
    this.gripper.enabled = !this.gripper.enabled
    const command = this.$armControlStore.createGripperCommand()
    this.sendCommandToArm(command)
  }

  openMenu() {
    this.menuOpen = true
    setTimeout(() => this.$refs.model.handleResize(), 300)
  }

  closeMenu() {
    this.menuOpen = false
    setTimeout(() => this.$refs.model.handleResize())
  }

  resetCamera() {
    eb.emit(EventType.CENTER_CAMERA)
  }

  toggleAntialias() {
    this.antialiasing = !this.antialiasing
    eb.emit(EventType.TOGGLE_ANTIALIASING)
  }
}
</script>

<style scoped lang="scss">
.__background {
  z-index: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.__model {
  z-index: 0;
  position: absolute;
  top: 0;
  height: 100%;
  left: 0;
  right: 0;

  :deep(.b-sidebar) {
    width: 40vw;
  }
}

.__menu {
  position: fixed;
  right: 1rem;
  top: 1rem;

  button:not(:last-child) {
    margin-right: 1rem;
  }
}

.__controls {
  position: fixed;
  left: 1rem;
  top: 1rem;

  button:not(:first-child) {
    margin-left: 1rem;
  }
}

@media only screen and (min-width: 1024px) {
  .__model.__shrink {
    right: 40vw;
  }
}
</style>
