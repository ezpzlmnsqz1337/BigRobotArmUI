<script lang="ts">
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import ws from '@/shared'
import { Component, Vue } from 'vue-property-decorator'

import { Command } from '@/store'

@Component
export default class ArmMixin extends Vue {
  joints = this.$armControlStore.arm.joints
  gripper = this.$armControlStore.arm.gripper

  get ready() {
    return this.$armControlStore.arm.isReady
  }

  sendCommandToArm(command: Command) {
    eb.emit(EventType.WS_MESSAGE_SEND, command)
    ws.send(command)
    this.$armControlStore.busy()
  }
}
</script>
