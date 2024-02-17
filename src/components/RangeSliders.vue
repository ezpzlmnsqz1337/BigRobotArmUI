<template>
  <div class="mt-3">
    <b-form-group v-for="j in joints" :key="j.name">
      <label :for="j.name">{{ j.name }}</label>
      <b-form-spinbutton
        :value="j[valueName][valueKey]"
        @input="onChange($event, j)"
        :min="j[valueName].min"
        :max="j[valueName].max"
        :step="step"
        :class="{ __modified: isModified(j) }"
        :disabled="!isConnected || !ready"
      ></b-form-spinbutton>
      <b-form-input
        :id="j.name"
        type="range"
        :name="j.name"
        :value="j[valueName][valueKey]"
        @input="onChange($event, j)"
        :min="j[valueName].min"
        :max="j[valueName].max"
        :step="step"
        :disabled="!isConnected || !ready"
      />
    </b-form-group>
  </div>
</template>

<script lang="ts">
import { Joint, NumberRangeData } from '@/assets/joints'
import ArmMixin from '@/mixins/ArmMixin.vue'
import { Component, Emit, Prop } from 'vue-property-decorator'

@Component
export default class RangeSliders extends ArmMixin {
  @Prop({ required: true }) readonly valueName!: keyof Pick<
    Joint,
    'speed' | 'acceleration' | 'position'
  >
  @Prop({ default: 'value' }) readonly valueKey!: keyof Pick<
    NumberRangeData,
    'value'
  >
  @Prop({ default: 'value' }) readonly diffKey!: keyof Pick<
    NumberRangeData,
    'value'
  >

  @Prop({ default: '10' }) readonly step!: string

  @Emit('on-change')
  onChange(event: string, joint: Joint) {
    ;(joint[this.valueName] as any)[this.valueKey] = parseInt(event)
  }

  isModified(j: Joint): boolean {
    return j[this.valueName][this.valueKey] !== j[this.valueName][this.diffKey]
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__modified {
  background-color: #0d6dfe3d !important;
  font-weight: bold;
}
</style>
