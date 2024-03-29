<template>
  <div>
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
    <div v-if="!editedSequence" class="__sequences">
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
            <div class="text-left">
              <h5 class="mb-1">{{ s.name }}</h5>
              <small>{{ s.data.length }} commands</small>
            </div>
            <b-button-group>
              <b-button @click="editSequence(index)"
                ><fa-icon icon="fa-solid fa-pen"
              /></b-button>
              <b-button variant="danger" v-b-modal.remove-sequence-modal
                ><fa-icon icon="fa-solid fa-trash-can"
              /></b-button>
            </b-button-group>
          </div>
        </b-list-group-item>
      </b-list-group>

      <div class="my-4">
        <b-button @click="play()" :disabled="!isConnected || !ready"
          ><fa-icon icon="fa-solid fa-play" />&nbsp;Play</b-button
        >
        <b-button @click="preview()"
          ><fa-icon icon="fa-solid fa-video" />&nbsp;Preview</b-button
        >
      </div>
    </div>

    <EditSequence :sequenceId="selected" />
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
  </div>
</template>

<script lang="ts">
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import ArmMixin from '@/mixins/ArmMixin.vue'
import EditSequence from '@/components/EditSequence.vue'
import { Command } from '@/store/communicationStore'
import { Component } from 'vue-property-decorator'
import { SerialMessage } from '@/constants/SerialMessage'

@Component({
  components: {
    EditSequence
  }
})
export default class Sequences extends ArmMixin {
  sequences = this.$sequencesStore.sequences
  selected = 0
  previewQueue: Command[] = []
  previewSpeed = '5'

  get isConnected() {
    return this.$connectionStore.connected
  }
  get editedSequence() {
    return this.$sequencesStore.editedSequence
  }

  created() {
    eb.on(EventType.ARM_IN_POSITION, () =>
      this.previewCommand(this.previewQueue.shift())
    )
  }

  play() {
    const sequence = this.sequences[this.selected].data
    sequence.forEach(x => this.sendCommand(x))
  }

  preview() {
    this.previewQueue = this.sequences[this.selected].data.map(x => x)
    this.previewCommand(this.previewQueue.shift())
  }

  previewCommand(command: Command | undefined) {
    if (!command) {
      this.$armControlStore.arm.preview = false
    } else {
      this.$armControlStore.arm.preview = true

      const positions = this.$communicationStore.parseJointsData(
        command.replace('G0', SerialMessage.POSITION),
        SerialMessage.POSITION
      )
      if (!positions) return
      this.$armControlStore.setTargetPositions(positions)
    }
  }

  sendCommand(command: Command) {
    this.sendCommandToArm(command)
  }

  setPreviewSpeed() {
    eb.emit(
      EventType.SET_PREVIEW_SPEED,
      parseInt(`${this.previewSpeed}`) / 1000
    )
  }

  removeSequence(sequenceId: number) {
    this.$sequencesStore.removeSequence(sequenceId)
    this.$bvModal.hide('remove-sequence-modal')
  }

  editSequence(sequenceId: number) {
    this.selected = sequenceId
    this.$sequencesStore.startEditSequence({
      name: this.sequences[sequenceId].name,
      data: this.sequences[sequenceId].data.join('\n')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__sequences :deep(.list-group) {
  height: 50vh;
  overflow-y: scroll;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 4px;
}

@media only screen and (max-width: 600px) {
  .__sequences :deep(.list-group) {
    height: 20vh;
  }
}
</style>
