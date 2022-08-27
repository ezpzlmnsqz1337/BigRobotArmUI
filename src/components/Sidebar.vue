<template>
  <b-sidebar
    id="sidebar-footer"
    title="Big Robot Arm UI"
    shadow
    right
    @change="change()"
  >
    <template #footer>
      <div class="d-flex justify-content-end px-3 py-3">
        <b-button variant="danger" @click="disconnect()"
          ><fa-icon icon="fa-solid fa-ban" />&nbsp;Disconnect</b-button
        >
      </div>
    </template>
    <b-tabs pills fill card>
      <b-tab class="my-3">
        <template #title>
          <fa-icon icon="fa-solid fa-terminal" />
        </template>
        <b-card-text><Terminal /></b-card-text>
      </b-tab>
      <b-tab class="my-3">
        <template #title>
          <fa-icon icon="fa-solid fa-gamepad" />
        </template>
        <ManualControl />
      </b-tab>
      <b-tab class="my-3">
        <template #title>
          <fa-icon icon="fa-solid fa-sliders" />
        </template>
        <Sequences />
      </b-tab>
      <b-tab class="my-3">
        <template #title>
          <fa-icon icon="fa-solid fa-square-plus" />
        </template>
        <RecordCommands />
      </b-tab>
    </b-tabs>
  </b-sidebar>
</template>

<script lang="ts">
import ManualControl from '@/components/ManualControl.vue'
import RecordCommands from '@/components/RecordCommands.vue'
import Sequences from '@/components/Sequences.vue'
import Terminal from '@/components/Terminal.vue'
import { WebsocketMessage } from '@/constants/WebsocketMessage'
import ws from '@/shared'
import { Vue, Component, Emit } from 'vue-property-decorator'

@Component({
  components: {
    ManualControl,
    Terminal,
    Sequences,
    RecordCommands
  }
})
export default class Sidebar extends Vue {
  @Emit('change')
  change() {}

  disconnect() {
    ws.send(WebsocketMessage.WS_DISCONNECT)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
