<template>
  <b-container fluid>
    <h2>Record commands</h2>
    <b-input-group>
      <b-form-input
        v-model="sequenceName"
        placeholder="Sequence name..."
      ></b-form-input>
      <b-button
        @click="saveSequence()"
        variant="primary"
        :disabled="!canSaveSequence"
        ><fa-icon icon="fa-solid fa-floppy-disk" />Save sequence</b-button
      >
    </b-input-group>
    <b-row v-for="(p, index) in commands" :key="'pos' + index">
      <b-col md="8">
        <b-form-input :value="p" disabled></b-form-input>
      </b-col>
      <b-col md="2">
        <b-button @click="execute(p)">Execute</b-button>
      </b-col>
      <b-col md="2">
        <b-button @click="remove(index)" variant="danger">Remove</b-button>
      </b-col>
    </b-row>
    <b-input-group>
      <label>Positions</label>
      <b-form-input :value="currentPositions" disabled></b-form-input>
      <b-button @click="addPositions()" variant="success"
        ><fa-icon icon="fa-solid fa-plus" />Add command</b-button
      >
    </b-input-group>

    <b-input-group>
      <label>Speeds</label>
      <b-form-input :value="currentSpeeds" disabled></b-form-input>
      <b-button @click="addSpeeds()" variant="success"
        ><fa-icon icon="fa-solid fa-plus" />Add command</b-button
      >
    </b-input-group>

    <b-input-group>
      <label>Accelerations</label>
      <b-form-input :value="currentAccelerations" disabled></b-form-input>
      <b-button @click="addAccelerations()" variant="success"
        ><fa-icon icon="fa-solid fa-plus" />Add command</b-button
      >
    </b-input-group>

    <b-input-group>
      <label>Sync motors</label>
      <b-form-input :value="currentSyncMotors" disabled></b-form-input>
      <b-button @click="addSyncMotors()" variant="success"
        ><fa-icon icon="fa-solid fa-plus" />Add command</b-button
      >
    </b-input-group>

    <b-input-group>
      <label>Gripper</label>
      <b-form-input :value="currentGripper" disabled></b-form-input>
      <b-button @click="addGripper()" variant="success"
        ><fa-icon icon="fa-solid fa-plus" />Add command</b-button
      >
    </b-input-group>
    <b-button @click="addAll()" variant="success"
      ><fa-icon icon="fa-solid fa-plus" />Add all</b-button
    >
  </b-container>
</template>

<script lang="ts">
import { Commands } from '@/constants/Commands'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Command } from '@/store'
import { Component } from 'vue-property-decorator'

@Component
export default class RecordPositions extends ArmMixin {
  sequenceName = ''
  commands: Command[] = []

  get currentPositions() {
    const p = this.$armControlStore.getJointsAttribute('position', 'target')
    return `${Commands.GO_TO} B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist}`
  }

  get currentSpeeds() {
    const s = this.$armControlStore.getJointsAttribute('speed', 'value')
    return `${Commands.SET_SPEEDS} B${s.base} S${s.shoulder} E${s.elbow} WR${s.wristRotate} W${s.wrist}`
  }

  get currentAccelerations() {
    const a = this.$armControlStore.getJointsAttribute('acceleration', 'value')
    return `${Commands.SET_ACCELERATIONS} B${a.base} S${a.shoulder} E${a.elbow} WR${a.wristRotate} W${a.wrist}`
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
