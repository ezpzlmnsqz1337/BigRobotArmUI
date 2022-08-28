<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import { Command } from '@/store/communicationStore'

@Component
export default class ArmMixin extends Vue {
  joints = this.$armControlStore.arm.joints
  gripper = this.$armControlStore.arm.gripper

  get ready() {
    return this.$armControlStore.arm.isReady
  }

  get isConnected() {
    return this.$connectionStore.connected
  }

  sendCommandToArm(command: Command) {
    this.$communicationStore.sendCommand(command)
    this.$armControlStore.busy()
  }
}
</script>
