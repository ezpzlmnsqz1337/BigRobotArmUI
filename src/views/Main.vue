<template>
  <b-container fluid class="text-center my-auto" style="height: 100%">
    <h1>Big Robot Arm UI</h1>
    <b-row v-show="!isConnected">
      <b-col>
        <b-button variant="success" size="lg" @click="connect()"
          >Connect</b-button
        >
      </b-col>
    </b-row>
    <div v-if="isConnected">
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
              <RecordPositions />
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <br />
      <b-row>
        <b-col>
          <b-button variant="danger" size="lg" @click="disconnect()"
            >Disconnect</b-button
          >
        </b-col>
      </b-row>
      <br />
    </div>
  </b-container>
</template>

<script lang="ts">
import ManualControl from '@/components/ManualControl.vue'
import Model from '@/components/Model.vue'
import RecordPositions from '@/components/RecordPositions.vue'
import Sequences from '@/components/Sequences.vue'
import Terminal from '@/components/Terminal.vue'
import { Commands } from '@/constants/Commands'
import { SerialMessage } from '@/constants/SerialMessage'
import { EventType } from '@/constants/types/EventType'
import { WebsocketMessage } from '@/constants/WebsocketMessage'
import eb from '@/EventBus'
import ArmMixin from '@/mixins/ArmMixin.vue'

import ws from '@/shared'
import { MessageRow } from '@/store'
import { Component } from 'vue-property-decorator'

@Component({
  components: {
    ManualControl,
    Terminal,
    Sequences,
    Model,
    RecordPositions
  }
})
export default class Main extends ArmMixin {
  get isConnected(): boolean {
    return this.$store.state.connected
  }

  created() {
    ws.onmessage = event => {
      console.log('Response from server: ', event.data)

      if (event.data.includes('connectionStatus')) {
        this.$store.setConnectionStatus(
          parseInt(event.data.split(':')[1]) === 1
        )
      } else {
        this.handleMessage(event.data)
      }

      eb.emit(EventType.WS_MESSAGE_RECEIVED, event.data)
    }
  }

  connect() {
    ws.send(WebsocketMessage.WS_CONNECT)
    ws.send(Commands.STATUS)
  }

  disconnect() {
    ws.send(WebsocketMessage.WS_DISCONNECT)
  }

  handleMessage(message: string) {
    if (message.includes(SerialMessage.READY)) this.$store.ready()
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
    const positions = this.$store.parsePositionFromMessageRow(messageRow)
    if (!positions.length) return
    this.$store.setTargetPositions(positions)
  }

  handleGripper(message: string) {
    const messageRow = this.getMessageRow(message, SerialMessage.GRIPPER)
    if (!messageRow) return
    const gripper = this.$store.parseGripperFromMessageRow(messageRow)
    this.$store.setGripperEnabled(gripper.enabled)
    this.$store.setGripperTargetPosition(gripper.target)
  }

  handleSpeed(message: string) {
    const messageRow = this.getMessageRow(message, SerialMessage.SPEED)
    if (!messageRow) return
    const speeds = this.$store.parseSpeedsFromMessageRow(messageRow)
    this.$store.setSpeeds(speeds)
  }

  handleAcceleration(message: string) {
    const messageRow = this.getMessageRow(message, SerialMessage.ACCELERATION)
    if (!messageRow) return
    const accelerations = this.$store.parseAccelerationsFromMessageRow(
      messageRow
    )
    this.$store.setAccelerations(accelerations)
  }

  handleSyncMotors(message: string) {
    const messageRow = this.getMessageRow(message, SerialMessage.SYNC_MOTORS)
    if (!messageRow) return
    const syncMotors = this.$store.parseSyncMotorsFromMessageRow(messageRow)
    this.$store.setSyncMotors(syncMotors)
  }

  getMessageRow(message: string, type: SerialMessage): MessageRow | undefined {
    return message
      .split('\n')
      .filter(x => x.includes(type))
      .pop()
  }
}
</script>

<style></style>
