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
    <b-list-group v-if="!edit">
      <b-list-group-item
        v-for="(s, index) in sequences"
        :key="`seq-${index}`"
        href="#"
        :active="index == selected"
        class="flex-column align-items-start"
        @click="selected = index"
      >
        <div class="d-flex w-100 justify-content-between">
          <div class="text-left">
            <h5 class="mb-1">{{ s.name }}</h5>
            <small>{{ s.data.length }} commands</small>
          </div>
          <b-button-group>
            <b-button size="sm" @click="editSequence(index)"
              >&#9998; Edit</b-button
            >
            <b-button variant="danger" size="sm" v-b-modal.remove-sequence-modal
              >&#x1F5D1; Remove</b-button
            >
          </b-button-group>
        </div>
      </b-list-group-item>
      <b-button-group>
        <b-button @click="play()" :disabled="disabled">Play</b-button>
        <b-button @click="preview()">Preview</b-button>
      </b-button-group>
    </b-list-group>
    <!-- Edit sequence -->
    <b-container v-if="edit && editedSequence" class="__edit">
      <h2>Edit sequence</h2>
      <label for="sequenceName">Name</label>
      <b-form-input if="sequenceName" v-model="editedSequence.name" />
      <label for="sequenceData" class="mt-3">Data</label>
      <b-textarea
        if="sequenceData"
        v-model="editedSequence.data"
        :rows="editedSequenceRows"
      />
      <b-button variant="success" @click="saveSequence()"
        >&#x1F5AB; Save</b-button
      >
      <b-button variant="danger" @click="cancelEditSequence()"
        >&#x1F5D1; Cancel</b-button
      >
    </b-container>
    <!-- modal -->
    <b-modal
      id="remove-sequence-modal"
      centered
      title="Remove sequence"
      header-bg-variant="danger"
      header-text-variant="light"
    >
      <p>Do you really want to remove this sequence?</p>
      <div slot="modal-footer" class="d-flex w-100 justify-content-around">
        <b-button variant="success" @click="removeSequence(selected)"
          >Yes</b-button
        >
        <b-button
          variant="danger"
          @click="$bvModal.hide('remove-sequence-modal')"
          >No</b-button
        >
      </div>
    </b-modal>
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
      previewSpeed: 5,
      edit: false,
      editedSequence: null
    }
  },
  created: function() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, e => this.handleMessage(e))
    eb.on(EventType.ARM_IN_POSITION, () =>
      this.previewCommand(this.previewQueue.shift())
    )
  },
  computed: {
    editedSequenceRows: function() {
      return this.editedSequence.data.split('\n').length
    }
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
      console.log('Comm: ', command)
      if (!command) {
        this.$arm.preview = false
      } else {
        this.$arm.preview = true
        const positions = this.$store.parsePositionFromMessage(command)
        this.$store.setTargetPositions(positions)
      }
    },
    sendCommand(command) {
      if (ws) ws.send(command)
    },
    handleMessage(message) {
      if (message.includes(SerialMessage.READY)) this.disabled = false
    },
    setPreviewSpeed() {
      eb.emit(EventType.SET_PREVIEW_SPEED, parseFloat(this.previewSpeed) / 1000)
    },
    removeSequence(index) {
      this.$store.removeSequence(index)
      this.$bvModal.hide('remove-sequence-modal')
    },
    editSequence(index) {
      this.selected = index
      this.editedSequence = {
        name: this.sequences[index].name,
        data: this.sequences[index].data.join('\n')
      }
      this.edit = true
    },
    saveSequence() {
      this.sequences[this.selected].name = this.editedSequence.name
      this.sequences[this.selected].data.splice(0)
      this.sequences[this.selected].data.push(
        ...this.editedSequence.data.split('\n')
      )
      this.edit = false
      this.$store.saveSequences()
    },
    cancelEditSequence() {
      this.edit = false
      this.editedSequence = null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__sequence {
  height: 15rem;
}
.__edit {
  text-align: left;
}
</style>
