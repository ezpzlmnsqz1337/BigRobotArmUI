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
    <div v-show="isConnected">
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
          <Sequences />
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
import ws from '@/shared'
import Terminal from '@/components/Terminal'
import ManualControl from '@/components/ManualControl'
import Sequences from '@/components/Sequences'
import Model from '@/components/Model'

export default {
  name: 'Main',
  components: {
    ManualControl,
    Terminal,
    Sequences,
    Model
  },
  data() {
    return {
      connectionStatus: 1
    }
  },
  computed: {
    isConnected: function() {
      return this.connectionStatus == 1
    }
  },
  created() {
    if (!ws) return
    ws.onopen = () => {
      if (ws) ws.send('connected')
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
      if (ws) ws.send('connect')
    },
    disconnect: function() {
      if (ws) ws.send('disconnect')
    }
  }
}
</script>

<style></style>
