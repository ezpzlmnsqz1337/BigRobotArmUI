<script lang="ts">
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import ws from '@/shared'
import { Component, Vue } from 'vue-property-decorator'

import { Command } from '@/store'

@Component
export default class ArmMixin extends Vue {
  joints = this.$arm.joints
  gripper = this.$arm.gripper

  get ready() {
    return this.$arm.ready
  }

  sendCommandToArm(command: Command) {
    eb.emit(EventType.WS_MESSAGE_SEND, command)
    ws.send(command)
    this.$store.busy()
  }
}
</script>
