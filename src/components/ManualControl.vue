<template>
  <b-container fluid>
    <h2>Manual control</h2>
    <b-row>
      <b-col class="my-auto controls">
        <b-form-group>
          <b-label for="base">Base</b-label>
          <b-form-input id="base" type="range" name="base" />
          <b-label for="shoulder">Shoulder</b-label>
          <b-form-input id="shoulder" type="range" name="shoulder" />
          <b-label for="elbow">Elbow</b-label>
          <b-form-input id="elbow" type="range" name="elbow" />
          <b-label for="wristRotate">Wrist Rotate</b-label>
          <b-form-input id="wristRotate" type="range" name="wristRotate" />
          <b-label for="wrist">Wrist</b-label>
          <b-form-input id="wrist" type="range" name="wrist" />
        </b-form-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ws from '@/shared'

export default {
  name: 'ManualControl',
  data() {
    return {
      base: 0,
      shoulder: 0,
      elbow: 0,
      wristRotate: 0,
      wrist: 0,
      gripper: 0
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
  },
  methods: {
    sendCommand() {
      ws.send('G0 X0 Y0 Z0 E0 F0')
    },
    handleMessage(message) {
      if (message.includes('armPositions')) {
        this.base = parseInt(message.split(':')[2])
        this.shoulder = parseInt(message.split(':')[4])
        this.elbow = parseInt(message.split(':')[6])
        this.wristRotate = parseInt(message.split(':')[8])
        this.wrist = parseInt(message.split(':')[10])
        this.gripper = parseInt(message.split(':')[12])
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.window {
  position: relative;
  margin: 0 auto;
}

.frame {
  position: absolute;
  height: 100%;
  width: 100%;
  border: 1rem solid #5c5c5c;
  background-color: #d9f6ff;
  z-index: 1;
}

.blind {
  position: absolute;
  z-index: 10;
  height: 100%;
  width: 100%;
  background-color: #a8a6b9;
  background-repeat: repeat;
  border-bottom: none;
  transform: scaleY(0);
  transform-origin: top;
  transition: transform 1s;
}

.blind.pending {
  z-index: 10;
  background-color: #fbff1f;
  background-image: none;
  animation: blinker 2s linear infinite;
}

.controls {
  padding-left: 0;
  padding-right: 0;
}

.controls button {
  height: 4rem;
}

@keyframes blinker {
  0% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.9;
  }
}

.handle {
  width: 1rem;
  margin-top: 0.5rem;
  position: absolute;
  right: -1.5rem;
  z-index: 999;
  color: gray;
  border-radius: 30%;
  transform: rotate(180deg);
  cursor: pointer;
  -webkit-appearance: slider-vertical; /* WebKit */
}

input[type='range']::-webkit-slider-thumb {
  border: 1px solid #00001e;
  border-radius: 15px;
  cursor: pointer;
}

input[type='range']::-webkit-slider-runnable-track {
  background: rgba(0, 0, 0, 0);
  cursor: pointer;
}
</style>
