<template>
  <div>
    <b-form-group
      label-cols-sm="12"
      label="Sequence name"
      class="text-left mt-2"
    >
      <b-input-group>
        <b-form-input
          v-model="sequenceName"
          placeholder="*My awesome sequence*"
        ></b-form-input>
        <b-button
          @click="saveSequence()"
          variant="primary"
          :disabled="!canSaveSequence"
          ><fa-icon icon="fa-solid fa-floppy-disk"
        /></b-button>
      </b-input-group>
    </b-form-group>

    <b-form-group
      label-cols-sm="12"
      label="Sequence commands"
      class="text-left mt-2"
    >
      <b-input-group v-for="(p, index) in commands" :key="'pos' + index">
        <b-form-input :value="p" disabled></b-form-input>
        <b-button @click="execute(p)"
          ><fa-icon icon="fa-solid fa-play"
        /></b-button>
        <b-button @click="remove(index)" variant="danger"
          ><fa-icon icon="fa-solid fa-ban"
        /></b-button>
      </b-input-group>
    </b-form-group>

    <b-form-group label-cols-lg="3" label-cols-sm="12" label="Positions">
      <b-input-group>
        <b-form-input :value="currentPositions" disabled></b-form-input>
        <b-button @click="addPositions()" variant="success"
          ><fa-icon icon="fa-solid fa-plus"
        /></b-button>
      </b-input-group>
    </b-form-group>

    <b-form-group label-cols-lg="3" label-cols-sm="12" label="Speeds">
      <b-input-group>
        <b-form-input :value="currentSpeeds" disabled></b-form-input>
        <b-button @click="addSpeeds()" variant="success"
          ><fa-icon icon="fa-solid fa-plus"
        /></b-button>
      </b-input-group>
    </b-form-group>

    <b-form-group label-cols-lg="3" label-cols-sm="12" label="Accelerations">
      <b-input-group>
        <b-form-input :value="currentAccelerations" disabled></b-form-input>
        <b-button @click="addAccelerations()" variant="success"
          ><fa-icon icon="fa-solid fa-plus"
        /></b-button>
      </b-input-group>
    </b-form-group>

    <b-form-group label-cols-lg="3" label-cols-sm="12" label="Sync motors">
      <b-input-group>
        <b-form-input :value="currentSyncMotors" disabled></b-form-input>
        <b-button @click="addSyncMotors()" variant="success"
          ><fa-icon icon="fa-solid fa-plus"
        /></b-button>
      </b-input-group>
    </b-form-group>

    <b-form-group label-cols-lg="3" label-cols-sm="12" label="Gripper">
      <b-input-group>
        <b-form-input :value="currentGripper" disabled></b-form-input>
        <b-button @click="addGripper()" variant="success"
          ><fa-icon icon="fa-solid fa-plus"
        /></b-button>
      </b-input-group>
    </b-form-group>

    <b-form-group>
      <b-button @click="addAll()" variant="success"
        ><fa-icon icon="fa-solid fa-plus" />&nbsp;Add all</b-button
      >
    </b-form-group>
  </div>
</template>

<script lang="ts">
import { Commands } from '@/constants/Commands'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Command } from '@/store/communicationStore'
import { Component } from 'vue-property-decorator'

@Component
export default class RecordPositions extends ArmMixin {
  sequenceName = ''
  commands: Command[] = []

  get currentPositions() {
    return this.$armControlStore.createPositionCommand()
  }

  get currentSpeeds() {
    return this.$armControlStore.createSpeedCommand()
  }

  get currentAccelerations() {
    return this.$armControlStore.createAccelerationCommand()
  }

  get currentSyncMotors() {
    const sm = this.$armControlStore.arm.syncMotors ? 1 : 0
    return `${Commands.SET_SYNC_MOTORS}${sm}`
  }

  get currentGripper() {
    const g = this.$armControlStore.arm.gripper
    const enable = this.$armControlStore.arm.gripper.enabled ? 1 : 0
    return `${Commands.GRIPPER} E${enable} P${g.position.value}`
  }

  get canSaveSequence() {
    return Boolean(this.commands.length && this.sequenceName.length > 3)
  }

  execute(command: Command) {
    this.sendCommandToArm(command)
  }

  remove(commandIndex: number) {
    this.commands.splice(commandIndex, 1)
  }

  addAll() {
    this.addPositions()
    this.addSpeeds()
    this.addAccelerations()
    this.addSyncMotors()
    this.addGripper()
  }

  addPositions() {
    this.commands.push(this.currentPositions)
  }

  addSpeeds() {
    this.commands.push(this.currentSpeeds)
  }

  addAccelerations() {
    this.commands.push(this.currentAccelerations)
  }

  addSyncMotors() {
    this.commands.push(this.currentSyncMotors)
  }

  addGripper() {
    this.commands.push(this.currentGripper)
  }

  saveSequence() {
    this.$sequencesStore.addSequence({
      name: this.sequenceName,
      data: [...this.commands]
    })
    this.sequenceName = ''
    this.commands.splice(0)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
