<template>
  <b-container fluid class="text-center my-auto" style="height: 100%">
    <h1>Big Robot Arm UI</h1>
    <b-row>
      <b-col>
        <Terminal />
      </b-col>
      <b-col>
        <ManualControl />
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
    return {}
  },
  created() {
    ws.onopen = () => {
      ws.send('getPositions')
    }

    ws.onmessage = event => {
      console.log('Response from server: ', event.data)
      this.$root.$emit('ws-message-received', event.data)
    }
  }
}
</script>

<style></style>
