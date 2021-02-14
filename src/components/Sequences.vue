<template>
  <b-container fluid>
    <h2>Sequences</h2>
    <b-form-group>
      <label for="previewSpeed">Preview speed</label>
      <b-form-input disabled :value="previewSpeed" />
      <b-form-input
        id="previewSpeed"
        type="range"
        name="previewSpeed"
        v-model="previewSpeed"
        @change="setPreviewSpeed()"
        min="1"
        max="10"
        step="1"
      />
    </b-form-group>
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
    <b-button @click="play()" :disabled="disabled">Play</b-button>
    <b-button @click="preview()">Preview</b-button>
  </b-container>
</template>

<script>
import ws from '@/shared'
import eb from '@/EventBus'
import EventType from '@/constants/types/EventType'
import SerialMessage from '@/constants/SerialMessage'

export default {
  name: 'Sequences',
  data() {
    return {
      sequences: this.$store.state.sequences,
      selected: 0,
      disabled: true,
      joints: this.$arm.joints,
      gripper: this.$arm.gripper,
      previewQueue: [],
      previewSpeed: 5
    }
  },
  created: function() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, e => this.handleMessage(e))
    eb.on(EventType.ARM_IN_POSITION, () =>
      this.previewCommand(this.previewQueue.shift())
    )
  },
  methods: {
    play() {
      const sequence = this.sequences[this.selected].data
      sequence.forEach(x => this.sendCommand(x))
      this.disabled = true
    },
    preview() {
      this.previewQueue = this.sequences[this.selected].data.map(x => x)
      this.previewCommand(this.previewQueue.shift())
    },
    previewCommand(command) {
      if (!command) return
      const positions = this.$store.parsePositionFromCommand(command)
      this.$store.setTargetPositions(positions)
    },
    sendCommand(command) {
      if (ws) ws.send(command)
    },
    handleMessage(message) {
      if (message.includes(SerialMessage.READY)) this.disabled = false
    },
    setPreviewSpeed() {
      eb.emit(EventType.SET_PREVIEW_SPEED, parseFloat(this.previewSpeed) / 1000)
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
