<template>
  <b-container fluid>
    <b-row>
      <b-col class="my-auto controls">
        <b-form-group>
          <label :for="gripper.name">{{ gripper.name }}</label>
          <b-row>
            <b-col md="12" lg="2">
              <b-form-input disabled :value="gripper.target" />
            </b-col>
            <b-col md="12" lg="10">
              <b-form-input
                :id="gripper.name"
                type="range"
                :name="gripper.name"
                v-model="gripper.target"
                @change="sendCommand()"
                :min="gripper.min"
                :max="gripper.max"
                :disabled="!ready"
              />
              <b-checkbox
                v-model="gripper.enable"
                @change="sendCommand()"
                :disabled="!ready"
                >Enabled</b-checkbox
              >
            </b-col>
          </b-row>
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Commands from '@/constants/Commands'
import arm from '@/mixins/arm.mixin'

export default {
  name: 'Gripper',
  mixins: [arm],
  methods: {
    sendCommand() {
      const p = this.gripper.target
      const e = this.gripper.enable ? 1 : 0
      const command = `${Commands.GRIPPER} E${e} P${p}`
      this.sendCommandToArm(command)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
