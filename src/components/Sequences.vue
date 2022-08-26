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
      <b-button-group>
        <b-button @click="play()" :disabled="!ready"
          ><fa-icon icon="fa-solid fa-play" />Play</b-button
        >
        <b-button @click="preview()"
          ><fa-icon icon="fa-solid fa-video" />Preview</b-button
        >
      </b-button-group>
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
import { Command } from '@/store'
import { Component } from 'vue-property-decorator'

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

  created() {
    eb.on(EventType.ARM_IN_POSITION, () =>
      this.previewCommand(this.previewQueue.shift())
    )
  }

  get editedSequence() {
    return this.$sequencesStore.editedSequence
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
      const positions = this.$serialCommStore.parsePositionFromMessageRow(
        command
      )
      if (!positions.length) return
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
  height: 22rem;
  overflow-y: scroll;
}
</style>
