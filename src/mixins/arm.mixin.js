import ws from '@/shared'
import eb from '@/EventBus'
import EventType from '@/constants/types/EventType'

export default {
  data: function() {
    return {
      joints: this.$arm.joints,
      gripper: this.$arm.gripper
    }
  },
  computed: {
    ready: function() {
      return this.$arm.ready
    }
  },
  methods: {
    sendCommandToArm: function(command) {
      eb.emit(EventType.WS_MESSAGE_SEND, command)
      ws.send(command)
      this.$store.busy()
    }
  }
}
