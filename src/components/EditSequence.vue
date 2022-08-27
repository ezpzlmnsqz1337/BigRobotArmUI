<template>
  <div v-if="editedSequence">
    <h2>Edit sequence</h2>

    <div class="text-left">
      <div class="font-weight-bold">Name</div>
      <b-form-input id="sequenceName" v-model="editedSequence.name" />
    </div>

    <div class="text-left">
      <div class="font-weight-bold mt-3">Data</div>
      <b-textarea v-model="editedSequence.data" :rows="editedSequenceRows" />
    </div>
    <b-button variant="success" @click="saveSequence()"
      ><fa-icon icon="fa-solid fa-floppy-disk" />Save</b-button
    >
    <b-button variant="danger" @click="cancelEditSequence()"
      ><fa-icon icon="fa-solid fa-ban" />Cancel</b-button
    >
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Sequences extends Vue {
  @Prop({ type: Number, default: -1 }) sequenceId!: number

  get editedSequence() {
    return this.$sequencesStore.editedSequence
  }

  get editedSequenceRows() {
    return this.editedSequence?.data.split('\n').length
  }

  saveSequence() {
    this.$sequencesStore.saveEditedSequence(this.sequenceId)
  }

  cancelEditSequence() {
    this.$sequencesStore.stopEditSequence()
  }
}
</script>

<style scoped lang="scss"></style>
