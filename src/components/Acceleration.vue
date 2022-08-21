<template>
  <b-container fluid>
    <h2>Acceleration</h2>
    <b-row>
      <b-col class="my-auto controls">
        <b-form-group v-for="j in joints" :key="j.name">
          <label :for="j.name">{{ j.name }}</label>
          <b-row>
            <b-col md="12" lg="2">
              <b-form-input disabled :value="j.acceleration" />
            </b-col>
            <b-col md="12" lg="10">
              <b-form-input
                :id="j.name"
                type="range"
                :name="j.name"
                v-model="j.acceleration"
                @change="sendCommand()"
                min="1"
                max="500"
                step="1"
                :disabled="!ready"
              />
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Commands } from '@/constants/Commands'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Component } from 'vue-property-decorator'

@Component
export default class Acceleration extends ArmMixin {
  sendCommand() {
    const p = this.$store.getJointsAttribute('acceleration')
    const command = `${Commands.SET_ACCELERATIONS} B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist}`
    this.sendCommandToArm(command)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
