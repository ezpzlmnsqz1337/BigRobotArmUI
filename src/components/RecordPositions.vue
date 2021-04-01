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
        >&#x1F5AB; Save sequence</b-button
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
        >&#x2B; Add command</b-button
      >
    </b-input-group>

    <b-input-group>
      <label>Speeds</label>
      <b-form-input :value="currentSpeeds" disabled></b-form-input>
      <b-button @click="addSpeeds()" variant="success"
        >&#x2B; Add command</b-button
      >
    </b-input-group>

    <b-input-group>
      <label>Accelerations</label>
      <b-form-input :value="currentAccelerations" disabled></b-form-input>
      <b-button @click="addAccelerations()" variant="success"
        >&#x2B; Add command</b-button
      >
    </b-input-group>

    <b-input-group>
      <label>Sync motors</label>
      <b-form-input :value="currentSyncMotors" disabled></b-form-input>
      <b-button @click="addSyncMotors()" variant="success"
        >&#x2B; Add command</b-button
      >
    </b-input-group>

    <b-input-group>
      <label>Gripper</label>
      <b-form-input :value="currentGripper" disabled></b-form-input>
      <b-button @click="addGripper()" variant="success"
        >&#x2B; Add command</b-button
      >
    </b-input-group>
    <b-button @click="addAll()" variant="success">&#x2B; Add all</b-button>
  </b-container>
</template>

<script>
import Commands from '@/constants/Commands'
import arm from '@/mixins/arm.mixin'

export default {
  name: 'RecordPositions',
  mixins: [arm],
  data() {
    return {
      sequenceName: '',
      commands: []
    }
  },
  computed: {
    currentPositions() {
      const p = this.$store.getJointsAttribute('target')
      return `${Commands.GO_TO} B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist}`
    },
    currentSpeeds() {
      const s = this.$store.getJointsAttribute('speed')
      return `${Commands.SET_SPEEDS} B${s.base} S${s.shoulder} E${s.elbow} WR${s.wristRotate} W${s.wrist}`
    },
    currentAccelerations() {
      const a = this.$store.getJointsAttribute('acceleration')
      return `${Commands.SET_ACCELERATIONS} B${a.base} S${a.shoulder} E${a.elbow} WR${a.wristRotate} W${a.wrist}`
    },
    currentSyncMotors() {
      const sm = this.$arm.syncMotors ? 1 : 0
      return `${Commands.SET_SYNC_MOTORS}${sm}`
    },
    currentGripper() {
      const g = this.$arm.gripper
      const enable = this.$arm.gripper.enable ? 1 : 0
      return `${Commands.GRIPPER} E${enable} P${g.position}`
    },
    canSaveSequence() {
      return Boolean(this.commands.length && this.sequenceName.length > 3)
    }
  },
  methods: {
    execute(command) {
      this.sendCommandToArm(command)
    },
    remove(commandIndex) {
      this.commands.splice(commandIndex, 1)
    },
    addAll() {
      this.addPositions()
      this.addSpeeds()
      this.addAccelerations()
      this.addSyncMotors()
      this.addGripper()
    },
    addPositions() {
      this.commands.push(this.currentPositions)
    },
    addSpeeds() {
      this.commands.push(this.currentSpeeds)
    },
    addAccelerations() {
      this.commands.push(this.currentAccelerations)
    },
    addSyncMotors() {
      this.commands.push(this.currentSyncMotors)
    },
    addGripper() {
      this.commands.push(this.currentGripper)
    },
    saveSequence() {
      this.$store.addSequence({
        name: this.sequenceName,
        data: [...this.commands]
      })
      this.sequenceName = ''
      this.commands.splice(0)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
