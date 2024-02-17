<template>
  <div class="my-4">
    <b-form-group>
      <label :for="gripper.name">{{ gripper.name }}</label>
      <b-form-spinbutton
        v-model="gripper.position.target"
        @change="sendCommand()"
        :min="gripper.position.min"
        :max="gripper.position.max"
        :step="step"
        :disabled="!isConnected || !gripper.enabled || !ready"
      ></b-form-spinbutton>

      <b-form-input
        :id="gripper.name"
        type="range"
        :name="gripper.name"
        v-model="gripperTarget"
        @change="sendCommand()"
        :min="gripper.position.min"
        :max="gripper.position.max"
        :step="`${step}`"
        :disabled="!isConnected || !ready"
      />
      <b-checkbox
        v-model="gripper.enabled"
        @change="sendCommand()"
        :disabled="!isConnected || !ready"
        size="lg"
        >Enabled</b-checkbox
      >
    </b-form-group>
  </div>
</template>

<script lang="ts">
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class Gripper extends ArmMixin {
  @Prop({ default: 20 }) readonly step!: number

  get gripperTarget(): number {
    return this.gripper.position.target
  }

  set gripperTarget(value: any) {
    this.gripper.position.target = parseInt(value)
  }

  sendCommand() {
    const command = this.$armControlStore.createGripperCommand()
    this.sendCommandToArm(command)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
