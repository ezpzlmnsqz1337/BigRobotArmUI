import {
  BASE_MAX_STEPS,
  BASE_MIN_STEPS,
  BASE_STEPS_PER_DEGREE,
  ELBOW_MAX_STEPS,
  ELBOW_MIN_STEPS,
  ELBOW_STEPS_PER_DEGREE,
  GRIPPER_MAX_POSITION,
  GRIPPER_MIN_POSITION,
  SHOULDER_MAX_STEPS,
  SHOULDER_MIN_STEPS,
  SHOULDER_STEPS_PER_DEGREE,
  WRIST_MAX_STEPS,
  WRIST_MIN_STEPS,
  WRIST_ROTATE_MAX_STEPS,
  WRIST_ROTATE_MIN_STEPS,
  WRIST_ROTATE_STEPS_PER_DEGREE,
  WRIST_STEPS_PER_DEGREE
} from '@/assets/config'
import sequences from '@/assets/sequences'
import { Object3D } from 'three'
import Vue from 'vue'

export interface StoreMethods {
  setConnectionStatus(status: boolean): void
  startConnecting(): void
  stopConnecting(): void
  home(): void
  getJointsAttribute(attribute: string, key?: string): JointsAttribute
  getJointByName(name: string): Joint | undefined
  parsePositionFromMessageRow(messageRow: MessageRow): JointPositionInfo[]
  setTargetPositions(positions: JointPositionInfo[]): void
  parseGripperFromMessageRow(messageRow: MessageRow): GripperMessageData
  setGripperEnabled(enabled: boolean): void
  setGripperTargetPosition(position: number): void
  parseSpeedsFromMessageRow(messageRow: MessageRow): JointSpeedInfo[]
  setSpeeds(speeds: JointSpeedInfo[]): void
  parseAccelerationsFromMessageRow(
    messageRow: MessageRow
  ): JointAccelerationInfo[]
  setAccelerations(accelerations: JointAccelerationInfo[]): void
  parseSyncMotorsFromMessageRow(messageRow: MessageRow): boolean
  setSyncMotors(syncMotors: boolean): void
  initSequences(): void
  saveSequences(): void
  addSequence(sequence: Sequence): void
  removeSequence(index: number): void
  busy(): void
  ready(): void
}

export interface AppStore extends StoreMethods {
  state: StoreState
}

export interface StoreState {
  sequences: Sequence[]
  connected: boolean
  isConnecting: boolean
  arm: RobotArmData
}

export interface Sequence {
  name: string
  data: string[]
}

export interface RobotArmData {
  joints: Joint[]
  gripper: Gripper
  preview: boolean
  syncMotors: boolean
  ready: boolean
}

export interface Joint {
  name: string
  position: JointPosition
  speed: JointSpeed
  acceleration: JointAcceleration
  stepsPerDegree: number
  mesh?: Object3D
  inverted: boolean
  rotationAxis: string
}

export interface Gripper {
  name: string
  position: GripperPosition
  enabled: boolean
  mesh: any
}

export interface GripperPosition {
  value: number
  min: number
  max: number
  target: number
}

export interface EditedSequence {
  name: string
  data: string
}

export interface GripperMessageData {
  target: number
  enabled: boolean
}

export type Command = string

export interface JointsAttribute {
  base?: number | string | boolean
  shoulder?: number | string | boolean
  elbow?: number | string | boolean
  wristRotate?: number | string | boolean
  wrist?: number | string | boolean
}

export interface JointPositionInfo {
  name: string
  value: number
}

export interface JointSpeedInfo {
  name: string
  value: number
}

export interface JointAccelerationInfo {
  name: string
  value: number
}

export interface JointPosition {
  value: number
  min: number
  max: number
  target: number
}

export interface JointSpeed {
  value: number
  min: number
  max: number
}

export interface JointAcceleration {
  value: number
  min: number
  max: number
}

export type Message = string
export type MessageRow = string

const state: StoreState = {
  sequences,
  connected: false,
  isConnecting: false,
  arm: {
    joints: [
      {
        name: 'base',
        position: {
          value: 0,
          min: BASE_MIN_STEPS,
          max: BASE_MAX_STEPS,
          target: 0
        },
        speed: {
          value: 100,
          min: 10,
          max: 500
        },
        acceleration: {
          value: 100,
          min: 10,
          max: 500
        },
        stepsPerDegree: BASE_STEPS_PER_DEGREE,
        mesh: undefined,
        inverted: false,
        rotationAxis: 'y'
      },
      {
        name: 'shoulder',
        position: {
          value: 0,
          min: SHOULDER_MIN_STEPS,
          max: SHOULDER_MAX_STEPS,
          target: 0
        },
        speed: {
          value: 100,
          min: 10,
          max: 500
        },
        acceleration: {
          value: 100,
          min: 10,
          max: 500
        },
        stepsPerDegree: SHOULDER_STEPS_PER_DEGREE,
        mesh: undefined,
        inverted: true,
        rotationAxis: 'z'
      },
      {
        name: 'elbow',
        position: {
          value: 0,
          min: ELBOW_MIN_STEPS,
          max: ELBOW_MAX_STEPS,
          target: 0
        },
        speed: {
          value: 100,
          min: 10,
          max: 500
        },
        acceleration: {
          value: 100,
          min: 10,
          max: 500
        },
        stepsPerDegree: ELBOW_STEPS_PER_DEGREE,
        mesh: undefined,
        inverted: true,
        rotationAxis: 'z'
      },
      {
        name: 'wristRotate',
        position: {
          value: 0,
          min: WRIST_ROTATE_MIN_STEPS,
          max: WRIST_ROTATE_MAX_STEPS,
          target: 0
        },
        speed: {
          value: 100,
          min: 10,
          max: 500
        },
        acceleration: {
          value: 100,
          min: 10,
          max: 500
        },
        stepsPerDegree: WRIST_ROTATE_STEPS_PER_DEGREE,
        mesh: undefined,
        inverted: true,
        rotationAxis: 'y'
      },
      {
        name: 'wrist',
        position: {
          value: 0,
          min: WRIST_MIN_STEPS,
          max: WRIST_MAX_STEPS,
          target: 0
        },
        speed: {
          value: 100,
          min: 10,
          max: 500
        },
        acceleration: {
          value: 100,
          min: 10,
          max: 500
        },
        stepsPerDegree: WRIST_STEPS_PER_DEGREE,
        mesh: undefined,
        inverted: false,
        rotationAxis: 'z'
      }
    ],
    gripper: {
      name: 'gripper',
      position: {
        value: 40,
        min: GRIPPER_MIN_POSITION,
        max: GRIPPER_MAX_POSITION,
        target: 40
      },
      enabled: true,
      mesh: null
    },
    preview: false,
    syncMotors: false,
    ready: false
  }
}

const store: AppStore = Vue.observable({
  state,
  setConnectionStatus(status: boolean) {
    this.state.connected = status
  },
  startConnecting() {
    this.state.isConnecting = true
  },
  stopConnecting() {
    this.state.isConnecting = false
  },
  home() {
    this.state.arm.joints.forEach(x => (x.position.target = 0))
    this.state.arm.gripper.position.target = GRIPPER_MIN_POSITION
  },
  getJointsAttribute(attribute: string, key?: string): JointsAttribute {
    return this.state.arm.joints.reduce((curr: any, acc: any) => {
      const value = key ? acc[attribute][key] : acc[attribute]
      curr[acc.name] = parseFloat(value)
      return curr
    }, {})
  },
  getJointByName(name: string): Joint | undefined {
    return this.state.arm.joints.find(x => x.name === name)
  },
  parsePositionFromMessageRow(messageRow: MessageRow): JointPositionInfo[] {
    const splitted = messageRow.split(' ')
    if (splitted[0] !== 'G0') return []
    const positions: JointPositionInfo[] = [
      {
        name: 'base',
        value: parseInt(splitted[1].substring(1))
      },
      {
        name: 'shoulder',
        value: parseInt(splitted[2].substring(1))
      },
      {
        name: 'elbow',
        value: parseInt(splitted[3].substring(1))
      },
      {
        name: 'wristRotate',
        value: parseInt(splitted[4].substring(2))
      },
      {
        name: 'wrist',
        value: parseInt(splitted[5].substring(1))
      }
    ]
    return positions
  },
  setTargetPositions(positions: JointPositionInfo[]) {
    this.getJointByName('base')!.position.target = positions[0].value
    this.getJointByName('shoulder')!.position.target = positions[1].value
    this.getJointByName('elbow')!.position.target = positions[2].value
    this.getJointByName('wristRotate')!.position.target = positions[3].value
    this.getJointByName('wrist')!.position.target = positions[4].value
  },
  parseGripperFromMessageRow(messageRow: MessageRow): GripperMessageData {
    const splitted = messageRow.split(' ')
    const enabled = parseInt(splitted[1].substring(1)) == 1 ? true : false
    const gripper = {
      enabled,
      target: parseInt(splitted[2].substring(1))
    }
    return gripper
  },
  setGripperEnabled(enabled: boolean) {
    this.state.arm.gripper.enabled = enabled
  },
  setGripperTargetPosition(position: number) {
    this.state.arm.gripper.position.target = position
  },
  parseSpeedsFromMessageRow(messageRow: MessageRow): JointSpeedInfo[] {
    const splitted = messageRow.split(' ')
    const speeds: JointSpeedInfo[] = [
      {
        name: 'base',
        value: parseInt(splitted[1].substring(1))
      },
      {
        name: 'shoulder',
        value: parseInt(splitted[2].substring(1))
      },
      {
        name: 'elbow',
        value: parseInt(splitted[3].substring(1))
      },
      {
        name: 'wristRotate',
        value: parseInt(splitted[4].substring(2))
      },
      {
        name: 'wrist',
        value: parseInt(splitted[5].substring(1))
      }
    ]
    return speeds
  },
  setSpeeds(speeds: JointSpeedInfo[]) {
    this.getJointByName('base')!.speed.value = speeds[0].value
    this.getJointByName('shoulder')!.speed.value = speeds[1].value
    this.getJointByName('elbow')!.speed.value = speeds[2].value
    this.getJointByName('wristRotate')!.speed.value = speeds[3].value
    this.getJointByName('wrist')!.speed.value = speeds[4].value
  },
  parseAccelerationsFromMessageRow(
    messageRow: MessageRow
  ): JointAccelerationInfo[] {
    const splitted = messageRow.split(' ')
    const accelerations: JointAccelerationInfo[] = [
      {
        name: 'base',
        value: parseInt(splitted[1].substring(1))
      },
      {
        name: 'shoulder',
        value: parseInt(splitted[2].substring(1))
      },
      {
        name: 'elbow',
        value: parseInt(splitted[3].substring(1))
      },
      {
        name: 'wristRotate',
        value: parseInt(splitted[4].substring(2))
      },
      {
        name: 'wrist',
        value: parseInt(splitted[5].substring(1))
      }
    ]
    return accelerations
  },
  setAccelerations(accelerations: JointAccelerationInfo[]) {
    this.getJointByName('base')!.acceleration.value = accelerations[0].value
    this.getJointByName('shoulder')!.acceleration.value = accelerations[1].value
    this.getJointByName('elbow')!.acceleration.value = accelerations[2].value
    this.getJointByName('wristRotate')!.acceleration.value =
      accelerations[3].value
    this.getJointByName('wrist')!.acceleration.value = accelerations[4].value
  },
  parseSyncMotorsFromMessageRow(messageRow: MessageRow): boolean {
    return parseInt(messageRow.split(' ')[1]) == 1 ? true : false
  },
  setSyncMotors(syncMotors: boolean) {
    this.state.arm.syncMotors = syncMotors
  },
  initSequences() {
    const seqs = localStorage.getItem('sequences')
    if (seqs) {
      this.state.sequences = JSON.parse(seqs)
    }
  },
  saveSequences() {
    localStorage.setItem('sequences', JSON.stringify(this.state.sequences))
  },
  addSequence(sequence: Sequence) {
    if (!sequence) return
    this.state.sequences.push(sequence)
    this.saveSequences()
  },
  removeSequence(index: number) {
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

export default store
