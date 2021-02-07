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
    window.addEventListener('resize', this.handleResize, false)
  },
  mounted: function() {
    this.setupModel()
  },
  methods: {
    handleMessage(message) {
      if (message.includes('READY')) this.disabled = false
    },
    handleResize() {
      if (this.arm) this.arm.handleResize()
    },
    setupModel() {
      const armWrapper = this.$refs.armWrapper
      this.arm = new Arm(armWrapper, this.$arm)
      this.arm.init()
    }
  },
  destroyed() {
    window.removeEventListener('resize')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__armWrapper {
  width: 100%;
  height: 240px;
  margin: 0 auto;
}

/* Medium devices (tablets, 768px and up) The navbar toggle appears at this breakpoint */
@media (min-width: 768px) {
  .__armWrapper {
    height: 240px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .__armWrapper {
    height: 480px;
    width: 40vw;
  }
}
</style>
