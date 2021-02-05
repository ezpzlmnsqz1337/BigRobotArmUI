import Vue from 'vue'
import {
  BASE_MIN_STEPS,
  BASE_MAX_STEPS,
  BASE_STEPS_PER_DEGREE,
  SHOULDER_MIN_STEPS,
  SHOULDER_MAX_STEPS,
  SHOULDER_STEPS_PER_DEGREE,
  ELBOW_MIN_STEPS,
  ELBOW_MAX_STEPS,
  ELBOW_STEPS_PER_DEGREE,
  WRIST_ROTATE_MIN_STEPS,
  WRIST_ROTATE_MAX_STEPS,
  WRIST_ROTATE_STEPS_PER_DEGREE,
  WRIST_MIN_STEPS,
  WRIST_MAX_STEPS,
  WRIST_STEPS_PER_DEGREE,
  GRIPPER_MIN_POSITION,
  GRIPPER_MAX_POSITION
} from '@/assets/config'

export default Vue.observable({
  state: {
    arm: {
      joints: [
        {
          name: 'base',
          position: 0,
          target: 0,
          min: BASE_MIN_STEPS,
          max: BASE_MAX_STEPS,
          stepsPerDegree: BASE_STEPS_PER_DEGREE,
          mesh: null,
          rotationAxis: 'y'
        },
        {
          name: 'shoulder',
          position: 0,
          target: 0,
          min: SHOULDER_MIN_STEPS,
          max: SHOULDER_MAX_STEPS,
          stepsPerDegree: SHOULDER_STEPS_PER_DEGREE,
          mesh: null,
          rotationAxis: 'x'
        },
        {
          name: 'elbow',
          position: 0,
          target: 0,
          min: ELBOW_MIN_STEPS,
          max: ELBOW_MAX_STEPS,
          stepsPerDegree: ELBOW_STEPS_PER_DEGREE,
          mesh: null,
          rotationAxis: 'x'
        },
        {
          name: 'wristRotate',
          position: 0,
          target: 0,
          min: WRIST_ROTATE_MIN_STEPS,
          max: WRIST_ROTATE_MAX_STEPS,
          stepsPerDegree: WRIST_ROTATE_STEPS_PER_DEGREE,
          mesh: null,
          rotationAxis: 'y'
        },
        {
          name: 'wrist',
          position: 0,
          target: 0,
          min: WRIST_MIN_STEPS,
          max: WRIST_MAX_STEPS,
          stepsPerDegree: WRIST_STEPS_PER_DEGREE,
          mesh: null,
          rotationAxis: 'x'
        }
      ],
      gripper: {
        name: 'gripper',
        position: 0,
        target: 0,
        min: GRIPPER_MIN_POSITION,
        max: GRIPPER_MAX_POSITION,
        mesh: null
      }
    }
  },
  home() {
    this.state.arm.joints.forEach(x => (x.target = 0))
  },
  getTargetPositions() {
    return this.state.arm.joints.reduce((curr, acc) => {
      curr[acc.name] = parseFloat(acc.target)
      return curr
    }, {})
  }
})
