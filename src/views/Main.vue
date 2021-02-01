<template>
  <b-container fluid class="text-center my-auto" style="height: 100%">
    <h1>Big Robot Arm UI</h1>
    <b-row v-show="!isConnected">
      <b-col>
        <b-button variant="success" size="large" @click="connect()"
          >Connect</b-button
        >
      </b-col>
    </b-row>
    <b-row v-show="isConnected">
      <b-col>
        <Terminal />
      </b-col>
      <b-col>
        <ManualControl />
      </b-col>
    </b-row>
    <b-row v-show="isConnected">
      <b-col>
        <b-button variant="danger" size="large" @click="disconnect()"
          >Disconnect</b-button
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ws from '@/shared'
import Terminal from '@/components/Terminal'
import ManualControl from '@/components/ManualControl'

export default {
  name: 'Main',
  components: {
    ManualControl,
    Terminal
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
    ws.onopen = () => {
      // ws.send('getPositions')
    }

    ws.onmessage = event => {
      console.log('Response from server: ', event.data)

      if (event.data.includes('connectionStatus')) {
        this.connectionStatus = parseInt(event.data.split(':')[1])
      }
      this.$root.$emit('ws-message-received', event.data)
    }
  },
  methods: {
    connect: function() {
      ws.send('connect')
    },
    disconnect: function() {
      ws.send('disconnect')
    }
  }
}
</script>

<style></style>
