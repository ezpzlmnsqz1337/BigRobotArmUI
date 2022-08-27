<template>
  <b-container fluid class="text-center my-auto">
    <Connect />

    <div v-if="isConnected" class="__background">
      <Model />
      <Sidebar v-if="isConnected" />
      <div class="text-right m-3">
        <b-button v-b-toggle.sidebar-footer size="lg">
          <fa-icon icon="fa-solid fa-bars" />
        </b-button>
      </div>
    </div>
  </b-container>
</template>

<script lang="ts">
import Connect from '@/components/Connect.vue'
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
    Connect,
    Sidebar
  }
})
export default class Main extends ArmMixin {
  get isConnected() {
    return this.$connectionStore.connected
  }

  created() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, message => this.handleMessage(message))
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
    const positions = this.$serialCommStore.parseJointsData(
      message,
      SerialMessage.POSITION
    )
    if (!positions) return
    this.$armControlStore.setTargetPositions(positions)
  }

  handleSpeed(message: string) {
    const speeds = this.$serialCommStore.parseJointsData(
      message,
      SerialMessage.SPEED
    )
    if (!speeds) return
    this.$armControlStore.setSpeeds(speeds)
  }

  handleAcceleration(message: string) {
    const accelerations = this.$serialCommStore.parseJointsData(
      message,
      SerialMessage.ACCELERATION
    )
    if (!accelerations) return
    this.$armControlStore.setAccelerations(accelerations)
  }

  handleGripper(message: string) {
    const gripper = this.$serialCommStore.parseGripper(message)
    if (!gripper) return
    this.$armControlStore.setGripperEnabled(gripper.enabled)
    this.$armControlStore.setGripperTargetPosition(gripper.target)
  }

  handleSyncMotors(message: string) {
    const syncMotors = this.$serialCommStore.parseSyncMotors(message)
    if (!syncMotors) return
    this.$armControlStore.setSyncMotors(syncMotors)
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
</style>
