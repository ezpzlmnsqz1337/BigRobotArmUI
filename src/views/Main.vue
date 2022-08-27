<template>
  <b-container fluid class="text-center my-auto" style="height: 100%">
    <Connect />
    <div v-if="isConnected" class="pt-4">
      <h1>Big Robot Arm UI</h1>
      <b-button variant="danger" @click="disconnect()" class="mb-4"
        ><fa-icon icon="fa-solid fa-ban" />&nbsp;Disconnect</b-button
      >
      <b-row>
        <b-col class="p-lg-5 mb-4" md="12" lg="6">
          <Model />
        </b-col>
        <b-col class="p-lg-5" md="12" lg="6">
          <b-card>
            <b-tabs pills fill>
              <b-tab class="my-3">
                <template #title>
                  <fa-icon icon="fa-solid fa-terminal" />
                </template>
                <Terminal />
              </b-tab>
              <b-tab class="my-3">
                <template #title>
                  <fa-icon icon="fa-solid fa-gamepad" />
                </template>
                <ManualControl />
              </b-tab>
              <b-tab class="my-3">
                <template #title>
                  <fa-icon icon="fa-solid fa-sliders" />
                </template>
                <Sequences />
              </b-tab>
              <b-tab class="my-3">
                <template #title>
                  <fa-icon icon="fa-solid fa-square-plus" />
                </template>
                <RecordCommands />
              </b-tab>
            </b-tabs>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </b-container>
</template>

<script lang="ts">
import ManualControl from '@/components/ManualControl.vue'
import Model from '@/components/Model.vue'
import RecordCommands from '@/components/RecordCommands.vue'
import Sequences from '@/components/Sequences.vue'
import Terminal from '@/components/Terminal.vue'
import Connect from '@/components/Connect.vue'
import { SerialMessage } from '@/constants/SerialMessage'
import { EventType } from '@/constants/types/EventType'
import { WebsocketMessage } from '@/constants/WebsocketMessage'
import ArmMixin from '@/mixins/ArmMixin.vue'
import ws from '@/shared'
import { Component } from 'vue-property-decorator'
import eb from '@/EventBus'

@Component({
  components: {
    ManualControl,
    Terminal,
    Sequences,
    Model,
    RecordCommands,
    Connect
  }
})
export default class Main extends ArmMixin {
  get isConnected() {
    return this.$connectionStore.connected
  }

  created() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, message => this.handleMessage(message))
  }

  disconnect() {
    ws.send(WebsocketMessage.WS_DISCONNECT)
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

<style scoped lang="scss"></style>
