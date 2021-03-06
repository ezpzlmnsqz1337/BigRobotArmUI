<template>
  <b-container fluid>
    <h2>Manual control</h2>
    <b-tabs>
      <b-tab title="Position">
        <Position />
      </b-tab>
      <b-tab title="Speed">
        <Speed />
      </b-tab>
      <b-tab title="Acceleration">
        <Acceleration />
      </b-tab>
      <b-tab title="Gripper">
        <Gripper />
      </b-tab>
    </b-tabs>
  </b-container>
</template>

<script>
import Acceleration from '@/components/Acceleration'
import Speed from '@/components/Speed'
import Position from '@/components/Position'
import Gripper from '@/components/Gripper'

export default {
  name: 'ManualControl',
  components: {
    Speed,
    Acceleration,
    Position,
    Gripper
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
