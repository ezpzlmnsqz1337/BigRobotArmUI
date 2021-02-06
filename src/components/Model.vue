<template>
  <b-container fluid>
    <h2>Model</h2>
    <b-row>
      <b-col class="my-auto controls"
        ><div ref="armWrapper" class="__armWrapper"
      /></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { Arm } from '@/helpers/Arm'

export default {
  name: 'Model',
  data() {
    return {
      arm: null,
      joints: this.$arm.joints
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
  },
  mounted: function() {
    const armWrapper = this.$refs.armWrapper
    this.arm = new Arm(armWrapper, this.$arm)
    this.arm.init()
  },
  methods: {
    handleMessage(message) {
      if (message.includes('READY')) this.disabled = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__armWrapper {
  width: 640px;
  height: 480px;
  margin: 0 auto;
}
</style>
