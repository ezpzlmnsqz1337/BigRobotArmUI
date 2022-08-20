<template>
  <b-container fluid>
    <h2>Speed</h2>
    <b-row>
      <b-col class="my-auto controls">
        <b-form-group v-for="j in joints" :key="j.name">
          <label :for="j.name">{{ j.name }}</label>
          <b-row>
            <b-col md="12" lg="2">
              <b-form-input disabled :value="j.speed" />
            </b-col>
            <b-col md="12" lg="10">
              <b-form-input
                :id="j.name"
                type="range"
                :name="j.name"
                v-model="j.speed"
                @change="sendCommand()"
                min="1"
                max="500"
                step="1"
                :disabled="!ready"
              />
            </b-col>
          </b-row>
        </b-form-group>
        <b-checkbox v-model="$arm.syncMotors" @change="sendSyncMotorsCommand()"
          >Sync motors</b-checkbox
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Commands } from '@/constants/Commands'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Command } from '@/store'
import { Component } from 'vue-property-decorator'

@Component
export default class Speed extends ArmMixin {
  sendCommand() {
    console.log('Speeds: ', this.$store.getJointsAttribute('speed'))
    const p = this.$store.getJointsAttribute('speed')
    const command: Command = `${Commands.SET_SPEEDS} B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist}`
    this.sendCommandToArm(command)
  }

  sendSyncMotorsCommand() {
    const sync = this.$arm.syncMotors ? 1 : 0
    const command: Command = `${Commands.SET_SYNC_MOTORS}${sync}`
    this.sendCommandToArm(command)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
