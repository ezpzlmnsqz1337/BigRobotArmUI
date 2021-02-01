<template>
  <b-container fluid class="text-center my-auto" style="height: 100%">
    <h1>Big Robot Arm UI</h1>
    <Terminal />
  </b-container>
</template>

<script>
import ws from '@/shared'
import Window from '@/components/Window'

export default {
  name: 'Main',
  components: {
    Window
  },
  data() {
    return {
      ignoreLimits: 0,
      pass: '',
      slide: 0,
      sliding: null
    }
  },
  created() {
    ws.onopen = () => {
      ws.send('getPositions')
    }

    ws.onmessage = event => {
      console.log('Response from server: ', event.data)
      this.$root.$emit('ws-message-received', event.data)
    }
  },
  methods: {}
}
</script>

<style></style>
