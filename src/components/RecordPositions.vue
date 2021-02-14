<template>
  <b-container fluid>
    <h2>Record positions</h2>
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
    <b-row v-for="(p, index) in positions" :key="'pos' + index">
      <b-col md="8">
        <b-form-input :value="p" disabled></b-form-input>
      </b-col>
      <b-col md="2">
        <b-button @click="goTo(p)">Go to</b-button>
      </b-col>
      <b-col md="2">
        <b-button @click="remove(index)" variant="danger">Remove</b-button>
      </b-col>
    </b-row>
    <b-input-group>
      <b-form-input :value="currentPosition" disabled></b-form-input>
      <b-button @click="addPosition()" variant="success"
        >&#x2B; Add position</b-button
      >
    </b-input-group>
  </b-container>
</template>

<script>
import ws from '@/shared'
import eb from '@/EventBus'
import EventType from '@/constants/types/EventType'

export default {
  name: 'RecordPositions',
  data() {
    return {
      sequenceName: '',
      positions: []
    }
  },
  computed: {
    currentPosition() {
      const p = this.$store.getTargetPositions()
      const g = this.$arm.gripper.target
      return `G0 B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist} G${g}`
    },
    canSaveSequence() {
      return Boolean(this.positions.length && this.sequenceName.length > 3)
    }
  },
  methods: {
    goTo(position) {
      eb.emit(EventType.WS_MESSAGE_SEND, position)
      if (ws) ws.send(position)
    },
    remove(positionIndex) {
      this.positions.splice(positionIndex, 1)
    },
    addPosition() {
      const p = this.$store.getTargetPositions()
      const g = this.$arm.gripper.target
      const position = `G0 B${p.base} S${p.shoulder} E${p.elbow} WR${p.wristRotate} W${p.wrist} G${g}`
      this.positions.push(position)
    },
    saveSequence() {
      this.$store.addSequence({
        name: this.sequenceName,
        data: [...this.positions]
      })
      this.sequenceName = ''
      this.positions.splice(0)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
