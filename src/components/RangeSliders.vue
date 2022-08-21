<template>
  <b-container fluid>
    <b-form-group v-for="j in joints" :key="j.name">
      <label :for="j.name">{{ j.name }}</label>
      <b-row>
        <b-col md="12" lg="2">
          <b-form-input disabled :value="j[valueName][valueKey]" />
        </b-col>
        <b-col md="12" lg="10">
          <b-form-input
            :id="j.name"
            type="range"
            :name="j.name"
            :value="j[valueName][valueKey]"
            @change="onChange($event, j)"
            :min="j[valueName].min"
            :max="j[valueName].max"
            :step="step"
            :disabled="!ready"
          />
        </b-col>
      </b-row>
    </b-form-group>
  </b-container>
</template>

<script lang="ts">
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Joint } from '@/store'
import { Component, Emit, Prop } from 'vue-property-decorator'

@Component
export default class RangeSliders extends ArmMixin {
  @Prop({ required: true }) readonly valueName!:
    | 'speed'
    | 'acceleration'
    | 'position'
  @Prop({ default: 'value' }) readonly valueKey!: 'value' | 'target'
  @Prop({ default: '1' }) readonly step!: string

  @Emit('on-change')
  onChange(event: string, joint: Joint) {
    ;(joint[this.valueName] as any)[this.valueKey] = parseInt(event)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
