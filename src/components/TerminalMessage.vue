<template>
  <div
    class="__message"
    :class="{
      __client: type === 'client',
      __server: type === 'server'
    }"
  >
    <div>
      <div class="__header">
        <fa-icon
          :icon="`fa-solid ' ${type === 'client' ? 'fa-user' : 'fa-robot'}`"
        />
        {{ type === 'client' ? 'You' : 'Robot arm' }}
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

export declare type TerminalMessageType = 'client' | 'server'

@Component
export default class TerminalMessage extends Vue {
  @Prop({ default: 'client', type: String, required: true })
  type!: TerminalMessageType
}
</script>

<style scoped lang="scss">
.__message {
  display: flex;
  padding: 1rem;
  border-radius: 0.3rem;
  white-space: pre-line;

  &.__client {
    text-align: end;
    justify-content: end;
    padding: 1rem 1rem 0 0;
  }

  &.__server {
    justify-content: start;
    text-align: start;
  }

  .__header {
    font-size: 0.8rem;
    margin-bottom: 0.2rem;
    font-style: italic;
    color: #cccccc;
  }

  &.__client > div {
    border-radius: 0.3rem;
    color: white;
    padding: 0.3rem 0.5rem;
    background-color: #007bff;
  }

  &.__server > div {
    border-radius: 0.3rem;
    color: white;
    padding: 0.3rem 0.5rem;
    background-color: #6c757d;
  }
}

@media only screen and (max-width: 600px) {
  .__content {
    height: 25vh;
  }
}
</style>
