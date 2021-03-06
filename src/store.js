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
import sequences from '@/assets/sequences'

export default Vue.observable({
  state: {
    sequences,
    arm: {
      joints: [
        {
          name: 'base',
          position: 0,
          target: 0,
          speed: 100,
          acceleration: 100,
          min: BASE_MIN_STEPS,
          max: BASE_MAX_STEPS,
          stepsPerDegree: BASE_STEPS_PER_DEGREE,
          mesh: null,
          inverted: false,
          rotationAxis: 'y'
        },
        {
          name: 'shoulder',
          position: 0,
          target: 0,
          speed: 100,
          acceleration: 100,
          min: SHOULDER_MIN_STEPS,
          max: SHOULDER_MAX_STEPS,
          stepsPerDegree: SHOULDER_STEPS_PER_DEGREE,
          mesh: null,
          inverted: true,
          rotationAxis: 'z'
        },
        {
          name: 'elbow',
          position: 0,
          target: 0,
          speed: 100,
          acceleration: 100,
          min: ELBOW_MIN_STEPS,
          max: ELBOW_MAX_STEPS,
          stepsPerDegree: ELBOW_STEPS_PER_DEGREE,
          mesh: null,
          inverted: true,
          rotationAxis: 'z'
        },
        {
          name: 'wristRotate',
          position: 0,
          target: 0,
          speed: 100,
          acceleration: 100,
          min: WRIST_ROTATE_MIN_STEPS,
          max: WRIST_ROTATE_MAX_STEPS,
          stepsPerDegree: WRIST_ROTATE_STEPS_PER_DEGREE,
          mesh: null,
          inverted: true,
          rotationAxis: 'y'
        },
        {
          name: 'wrist',
          position: 0,
          target: 0,
          speed: 100,
          acceleration: 100,
          min: WRIST_MIN_STEPS,
          max: WRIST_MAX_STEPS,
          stepsPerDegree: WRIST_STEPS_PER_DEGREE,
          mesh: null,
          inverted: false,
          rotationAxis: 'z'
        }
      ],
      gripper: {
        name: 'gripper',
        position: 40,
        target: 40,
        enable: true,
        min: GRIPPER_MIN_POSITION,
        max: GRIPPER_MAX_POSITION,
        mesh: null
      },
      preview: false,
      syncMotors: false,
      ready: false
    }
  },
  home() {
    this.state.arm.joints.forEach(x => (x.target = 0))
    this.state.arm.gripper.target = GRIPPER_MIN_POSITION
  },
  getJointsAttribute(attribute) {
    return this.state.arm.joints.reduce((curr, acc) => {
      curr[acc.name] = parseFloat(acc[attribute])
      return curr
    }, {})
  },
  getJointByName(name) {
    return this.state.arm.joints.find(x => x.name === name)
  },
  parsePositionFromMessage(message) {
    message = message.split(' ')
    const positions = [
      {
        name: 'base',
        value: parseInt(message[1].substring(1))
      },
      {
        name: 'shoulder',
        value: parseInt(message[2].substring(1))
      },
      {
        name: 'elbow',
        value: parseInt(message[3].substring(1))
      },
      {
        name: 'wristRotate',
        value: parseInt(message[4].substring(2))
      },
      {
        name: 'wrist',
        value: parseInt(message[5].substring(1))
      }
    ]
    return positions
  },
  setTargetPositions(positions) {
    this.getJointByName('base').target = positions[0].value
    this.getJointByName('shoulder').target = positions[1].value
    this.getJointByName('elbow').target = positions[2].value
    this.getJointByName('wristRotate').target = positions[3].value
    this.getJointByName('wrist').target = positions[4].value
  },
  parseGripperFromMessage(message) {
    message = message.split(' ')
    const enabled = parseInt(message[1].substring(1)) == 1 ? true : false
    const gripper = {
      enabled,
      target: parseInt(message[2].substring(1))
    }
    return gripper
  },
  setGripperEnabled(enabled) {
    this.state.arm.gripper.enable = enabled
  },
  setGripperTargetPosition(position) {
    this.state.arm.gripper.target = position
  },
  parseSpeedsFromMessage(message) {
    message = message.split(' ')
    const speeds = [
      {
        name: 'base',
        value: parseInt(message[1].substring(1))
      },
      {
        name: 'shoulder',
        value: parseInt(message[2].substring(1))
      },
      {
        name: 'elbow',
        value: parseInt(message[3].substring(1))
      },
      {
        name: 'wristRotate',
        value: parseInt(message[4].substring(2))
      },
      {
        name: 'wrist',
        value: parseInt(message[5].substring(1))
      }
    ]
    return speeds
  },
  setSpeeds(speeds) {
    this.getJointByName('base').speed = speeds[0].value
    this.getJointByName('shoulder').speed = speeds[1].value
    this.getJointByName('elbow').speed = speeds[2].value
    this.getJointByName('wristRotate').speed = speeds[3].value
    this.getJointByName('wrist').speed = speeds[4].value
  },
  parseAccelerationsFromMessage(message) {
    message = message.split(' ')
    const accelerations = [
      {
        name: 'base',
        value: parseInt(message[1].substring(1))
      },
      {
        name: 'shoulder',
        value: parseInt(message[2].substring(1))
      },
      {
        name: 'elbow',
        value: parseInt(message[3].substring(1))
      },
      {
        name: 'wristRotate',
        value: parseInt(message[4].substring(2))
      },
      {
        name: 'wrist',
        value: parseInt(message[5].substring(1))
      }
    ]
    return accelerations
  },
  setAccelerations(accelerations) {
    this.getJointByName('base').acceleration = accelerations[0].value
    this.getJointByName('shoulder').acceleration = accelerations[1].value
    this.getJointByName('elbow').acceleration = accelerations[2].value
    this.getJointByName('wristRotate').acceleration = accelerations[3].value
    this.getJointByName('wrist').acceleration = accelerations[4].value
  },
  parseSyncMotorsFromMessage(message) {
    message = parseInt(message.split(' ')[1]) == 1 ? true : false
    return message
  },
  setSyncMotors(syncMotors) {
    this.state.arm.syncMotors = syncMotors
  },
  initSequences() {
    const seqs = localStorage.getItem('sequences')
    if (seqs) this.state.sequences = JSON.parse(seqs)
  },
  saveSequences() {
    localStorage.setItem('sequences', JSON.stringify(this.state.sequences))
  },
  addSequence(sequence) {
    if (!sequence) return
    this.state.sequences.push(sequence)
    this.saveSequences()
  },
  removeSequence(index) {
    if (index < 0 && index > this.state.sequences.length - 1) return
    this.state.sequences.splice(index, 1)
    this.saveSequences()
  },
  busy() {
    this.state.arm.ready = false
  },
  ready() {
    this.state.arm.ready = true
  }
})
