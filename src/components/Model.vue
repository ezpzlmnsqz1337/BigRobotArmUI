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
import eb from '@/EventBus'
import EventType from '@/constants/types/EventType'
import SerialMessage from '@/constants/SerialMessage'

export default {
  name: 'Model',
  data() {
    return {
      arm: null,
      joints: this.$arm.joints
    }
  },
  created: function() {
    eb.on(EventType.WS_MESSAGE_RECEIVED, e => this.handleMessage(e))
    window.addEventListener(EventType.WINDOW_RESIZE, this.handleResize, false)
    this.$store.initSequences()
  },
  mounted: function() {
    setTimeout(() => this.setupModel(), 500)
  },
  methods: {
    handleMessage(message) {
      if (message.includes(SerialMessage.READY)) this.disabled = false
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
    window.removeEventListener(EventType.WINDOW_RESIZE, this.handleResize)
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

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  .__armWrapper {
    height: 480px;
    width: 40vw;
  }
}
</style>
