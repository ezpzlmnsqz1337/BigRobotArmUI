<template>
  <b-container fluid>
    <h2>Command line</h2>
    <b-row>
      <b-col class="my-auto controls">
        <b-textarea v-model="serialOutput"></b-textarea>
      </b-col>
      <b-col>
        <b-input-group>
          <b-form-input
            placeholder="Enter command..."
            v-model="command"
          ></b-form-input>
          <b-button @click="sendCommand()">Send</b-button>
        </b-input-group>
      </b-col>
  </b-container>
</template>

<script>
import ws from '@/shared'
import sha256 from 'crypto-js/sha256'

export default {
  name: 'Terminal',
  data() {
    return {
     serialOutput: "",
     command: ""
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
  },
  methods: {
    sendCommand(){
      ws.send(`${command}\r`)
      this.serialOutput += `Send: ${command}\n`
    },
    handleMessage(message){
      this.serialOutput += `Receive: ${message}\n`
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
