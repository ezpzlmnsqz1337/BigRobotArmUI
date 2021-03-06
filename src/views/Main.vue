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
          <Terminal />
        </b-col>
      </b-row>
      <b-row>
        <b-col class="p-lg-5" md="12" lg="6">
          <ManualControl />
        </b-col>
        <b-col class="p-lg-5" md="12" lg="6">
          <b-row>
            <b-col>
              <Sequences />
            </b-col>
          </b-row>
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

<script>
import Commands from '@/constants/Commands'
import Terminal from '@/components/Terminal'
import ManualControl from '@/components/ManualControl'
import Sequences from '@/components/Sequences'
import RecordPositions from '@/components/RecordPositions'
import Model from '@/components/Model'
import eb from '@/EventBus'
import EventType from '@/constants/types/EventType'
import WebsocketMessage from '@/constants/WebsocketMessage'
import SerialMessage from '@/constants/SerialMessage'
import ws from '@/shared'

export default {
  name: 'Main',
  components: {
    ManualControl,
    Terminal,
    Sequences,
    Model,
    RecordPositions
  },
  data() {
    return {
      connectionStatus: 0
    }
  },
  computed: {
    isConnected: function() {
      return this.connectionStatus == 1
    }
  },
  created() {
    // const mh = new MessageHandler()
    // mh.init()
    if (!ws) return
    ws.onopen = () => {
      if (ws) ws.send(Commands.STATUS)
    }

    ws.onmessage = event => {
      console.log('Response from server: ', event.data)

      if (event.data.includes('connectionStatus')) {
        this.connectionStatus = parseInt(event.data.split(':')[1])
      } else {
        this.handleMessage(event.data)
      }

      eb.emit(EventType.WS_MESSAGE_RECEIVED, event.data)
    }
  },
  methods: {
    connect: function() {
      if (ws) {
        ws.send(WebsocketMessage.WS_CONNECT)
        ws.send(Commands.STATUS)
      }
    },
    disconnect: function() {
      if (ws) ws.send(WebsocketMessage.WS_DISCONNECT)
    },
    handleMessage(message) {
      console.log(message)
      if (message.includes(SerialMessage.POSITION)) {
        this.handlePositions(message)
      }
      if (message.includes(SerialMessage.GRIPPER)) {
        this.handleGripper(message)
      }
      if (message.includes(SerialMessage.SPEED)) {
        this.handleSpeed(message)
      }
      if (message.includes(SerialMessage.ACCELERATION)) {
        this.handleAcceleration(message)
      }
      if (message.includes(SerialMessage.SYNC_MOTORS)) {
        this.handleSyncMotors(message)
      }
    },
    handlePositions(message) {
      message = this.getMessageRow(message, SerialMessage.POSITION)
      if (!message) return
      const positions = this.$store.parsePositionFromMessage(message)
      this.$store.setTargetPositions(positions)
    },
    handleGripper(message) {
      message = this.getMessageRow(message, SerialMessage.GRIPPER)
      if (!message) return
      const gripper = this.$store.parseGripperFromMessage(message)
      this.$store.setGripperEnabled(gripper.enabled)
      this.$store.setGripperTargetPosition(gripper.target)
    },
    handleSpeed(message) {
      message = this.getMessageRow(message, SerialMessage.SPEED)
      if (!message) return
      const speeds = this.$store.parseSpeedsFromMessage(message)
      this.$store.setSpeeds(speeds)
    },
    handleAcceleration(message) {
      message = this.getMessageRow(message, SerialMessage.ACCELERATION)
      if (!message) return
      const accelerations = this.$store.parseAccelerationsFromMessage(message)
      this.$store.setAccelerations(accelerations)
    },
    handleSyncMotors(message) {
      message = this.getMessageRow(message, SerialMessage.SYNC_MOTORS)
      if (!message) return
      const syncMotors = this.$store.parseSyncMotorsFromMessage(message)
      this.$store.setSyncMotors(syncMotors)
    },
    getMessageRow(message, type) {
      return message
        .split('\n')
        .filter(x => x.includes(type))
        .pop()
    }
  }
}
</script>

<style></style>
