<script lang="ts">
import { Commands } from '@/constants/Commands'
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
    const sent = this.$communicationStore.sendCommand(command)
    if (!sent) return

    // Read-only status requests do not move the arm, so they must not block
    // further commands until the next READY message arrives.
    if (command !== Commands.STATUS) this.$armControlStore.busy()
  }
}
</script>
