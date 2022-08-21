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

<script lang="ts">
import Acceleration from '@/components/Acceleration.vue'
import Gripper from '@/components/Gripper.vue'
import Position from '@/components/Position.vue'
import Speed from '@/components/Speed.vue'

import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    Speed,
    Acceleration,
    Position,
    Gripper
  }
})
export default class ManualControl extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
