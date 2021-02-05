<template>
  <b-container fluid>
    <h2>Sequences</h2>
    <b-list-group>
      <b-list-group-item
        v-for="(s, index) in sequences"
        :key="`seq-${index}`"
        href="#"
        :active="index == selected"
        class="flex-column align-items-start"
        @click="selected = index"
      >
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">{{ s.name }}</h5>
          <small>{{ s.data.length }} commands</small>
        </div>
      </b-list-group-item>
    </b-list-group>
    <b-button @click="playSequence()" :disabled="disabled">Play</b-button>
  </b-container>
</template>

<script>
import ws from '@/shared'
import sequences from '@/assets/sequences'

export default {
  name: 'Sequences',
  data() {
    return {
      sequences,
      selected: 0,
      disabled: true
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
  },
  methods: {
    playSequence() {
      const sequence = this.sequences[this.selected].data
      sequence.forEach(x => this.sendCommand(x))
      this.disabled = true
    },
    sendCommand(command) {
      if(ws) ws.send(command)
    },
    handleMessage(message) {
      if (message.includes('READY')) this.disabled = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__sequence {
  height: 15rem;
}
</style>
