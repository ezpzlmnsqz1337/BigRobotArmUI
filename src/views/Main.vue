<template>
  <b-container fluid class="text-center my-auto" style="height: 100%">
    <Connect />
    <div v-if="isConnected" class="mt-4">
      <h1>Big Robot Arm UI</h1>
      <b-button variant="danger" @click="disconnect()"
        ><fa-icon icon="fa-solid fa-ban" />Disconnect</b-button
      >
      <b-row>
        <b-col class="p-lg-5" md="12" lg="6">
          <Model />
        </b-col>
        <b-col class="p-lg-5" md="12" lg="6">
          <b-tabs>
            <b-tab title="Terminal" class="my-4">
              <Terminal />
            </b-tab>
            <b-tab title="Sequences" class="my-4">
              <Sequences />
            </b-tab>
          </b-tabs>
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-lg-5" md="12" lg="6">
          <ManualControl />
        </b-col>
        <b-col class="p-lg-5" md="12" lg="6">
          <b-row>
            <b-col class="mt-5">
              <RecordCommands />
            </b-col>
          </b-row>
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
import { MessageRow } from '@/store'
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
    const messageRow = this.getMessageRow(message, SerialMessage.POSITION)
    if (!messageRow) return
    const positions = this.$serialCommStore.parsePositionFromMessageRow(
      messageRow
    )
    if (!positions.length) return
    this.$armControlStore.setTargetPositions(positions)
  }

  handleGripper(message: string) {
    const messageRow = this.getMessageRow(message, SerialMessage.GRIPPER)
    if (!messageRow) return
    const gripper = this.$serialCommStore.parseGripperFromMessageRow(messageRow)
    this.$armControlStore.setGripperEnabled(gripper.enabled)
    this.$armControlStore.setGripperTargetPosition(gripper.target)
  }

  handleSpeed(message: string) {
    const messageRow = this.getMessageRow(message, SerialMessage.SPEED)
    if (!messageRow) return
    const speeds = this.$serialCommStore.parseSpeedsFromMessageRow(messageRow)
    this.$armControlStore.setSpeeds(speeds)
  }

  handleAcceleration(message: string) {
    const messageRow = this.getMessageRow(message, SerialMessage.ACCELERATION)
    if (!messageRow) return
    const accelerations = this.$serialCommStore.parseAccelerationsFromMessageRow(
      messageRow
    )
    this.$armControlStore.setAccelerations(accelerations)
  }

  handleSyncMotors(message: string) {
    const messageRow = this.getMessageRow(message, SerialMessage.SYNC_MOTORS)
    if (!messageRow) return
    const syncMotors = this.$serialCommStore.parseSyncMotorsFromMessageRow(
      messageRow
    )
    this.$armControlStore.setSyncMotors(syncMotors)
  }

  getMessageRow(message: string, type: SerialMessage): MessageRow | undefined {
    return message
      .split('\n')
      .filter(x => x.includes(type))
      .pop()
  }
}
</script>

<style scoped lang="scss"></style>
