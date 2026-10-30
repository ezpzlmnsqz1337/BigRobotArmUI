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
      <b-alert v-if="jobError" show variant="danger" class="text-left">
        {{ jobError }}
      </b-alert>

      <b-card v-if="activeJob" class="mb-3 text-left">
        <div><strong>Active job:</strong> {{ activeJob.name }}</div>
        <div><strong>Status:</strong> {{ activeJob.status }}</div>
        <div>
          <strong>Progress:</strong> {{ activeJob.currentIndex }} /
          {{ activeJob.total }}
        </div>
        <div v-if="activeJob.error">
          <strong>Error:</strong> {{ activeJob.error }}
        </div>
      </b-card>

      <b-card v-if="queuedJobs.length" class="mb-3 text-left">
        <div><strong>Queued jobs:</strong> {{ queuedJobs.length }}</div>
        <ul class="pl-3 mb-0">
          <li v-for="job in queuedJobs" :key="job.jobId">
            {{ job.name }} ({{ job.currentIndex }} / {{ job.total }})
          </li>
        </ul>
      </b-card>

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
        <b-button @click="play()" :disabled="!isConnected || !sequences.length"
          ><fa-icon icon="fa-solid fa-play" />&nbsp;Play</b-button
        >
        <b-button @click="preview()" :disabled="!sequences.length"
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
import { Commands } from '@/constants/Commands'
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import ArmMixin from '@/mixins/ArmMixin.vue'
import EditSequence from '@/components/EditSequence.vue'
import { Command } from '@/store/communicationStore'
import { Sequence } from '@/store/sequencesStore'
import { Component, Watch } from 'vue-property-decorator'
import { SerialMessage } from '@/constants/SerialMessage'

@Component({
  components: {
    EditSequence
  }
})
export default class Sequences extends ArmMixin {
  selected = 0
  previewQueue: Command[] = []
  previewSpeed = '5'

  readonly handleArmInPosition = () => {
    this.previewCommand(this.previewQueue.shift())
  }

  get sequences() {
    return this.$sequencesStore.sequences
  }
  get selectedSequence(): Sequence | undefined {
    return this.sequences[this.selected]
  }
  get isConnected() {
    return this.$connectionStore.connected
  }
  get editedSequence() {
    return this.$sequencesStore.editedSequence
  }
  get activeJob() {
    return this.$jobStore.activeJob
  }
  get queuedJobs() {
    return this.$jobStore.queuedJobs
  }
  get jobError() {
    return this.$jobStore.lastError
  }

  created() {
    eb.on(EventType.ARM_IN_POSITION, this.handleArmInPosition)
  }

  destroyed() {
    eb.off(EventType.ARM_IN_POSITION, this.handleArmInPosition)
  }

  @Watch('sequences')
  onSequencesChanged() {
    this.clampSelected()
  }

  play() {
    const sequence = this.selectedSequence
    if (!sequence) return

    this.$jobStore.setError(null)
    this.$communicationStore.sendJob(sequence.name, sequence.data)
    this.$armControlStore.busy()
  }

  preview() {
    const sequence = this.selectedSequence
    if (!sequence) return

    this.previewQueue = [...sequence.data]
    this.previewCommand(this.previewQueue.shift())
  }

  previewCommand(command: Command | undefined) {
    let nextCommand = command

    while (nextCommand) {
      if (nextCommand.trim().startsWith(`${Commands.GO_TO} `)) {
        const positions = this.$communicationStore.parseJointsData(
          nextCommand.replace(Commands.GO_TO, SerialMessage.POSITION),
          SerialMessage.POSITION
        )

        if (positions) {
          this.$armControlStore.arm.preview = true
          this.$armControlStore.setTargetPositions(positions)
          return
        }
      }

      nextCommand = this.previewQueue.shift()
    }

    // Nothing left to preview: stop the 3D preview instead of leaving it stuck
    // on a command that does not contain joint positions.
    this.$armControlStore.arm.preview = false
  }

  setPreviewSpeed() {
    eb.emit(
      EventType.SET_PREVIEW_SPEED,
      parseInt(`${this.previewSpeed}`) / 1000
    )
  }

  removeSequence(sequenceId: number) {
    this.$sequencesStore.removeSequence(sequenceId)
    this.clampSelected()
    this.$bvModal.hide('remove-sequence-modal')
  }

  editSequence(sequenceId: number) {
    const sequence = this.sequences[sequenceId]
    if (!sequence) return

    this.selected = sequenceId
    this.$sequencesStore.startEditSequence({
      name: sequence.name,
      data: sequence.data.join('\n')
    })
  }

  clampSelected() {
    this.selected = Math.min(
      this.selected,
      Math.max(0, this.sequences.length - 1)
    )
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
