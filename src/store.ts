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
  home(): void
  getJointsAttribute(attribute: string): JointsAttribute
  getJointByName(name: string): Joint | undefined
  parsePositionFromMessageRow(messageRow: MessageRow): JointPosition[]
  setTargetPositions(positions: JointPosition[]): void
  parseGripperFromMessageRow(messageRow: MessageRow): GripperMessageData
  setGripperEnabled(enabled: boolean): void
  setGripperTargetPosition(position: number): void
  parseSpeedsFromMessageRow(messageRow: MessageRow): JointSpeed[]
  setSpeeds(speeds: JointSpeed[]): void
  parseAccelerationsFromMessageRow(messageRow: MessageRow): JointAcceleration[]
  setAccelerations(accelerations: JointAcceleration[]): void
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
  position: number
  target: number
  speed: number
  acceleration: number
  min: number
  max: number
  stepsPerDegree: number
  mesh?: Object3D
  inverted: boolean
  rotationAxis: string
}

export interface Gripper {
  name: string
  position: number
  target: number
  enabled: boolean
  min: number
  max: number
  mesh: any
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

export interface JointPosition {
  name: string
  value: number
}

export interface JointSpeed {
  name: string
  value: number
}

export interface JointAcceleration {
  name: string
  value: number
}

export type Message = string
export type MessageRow = string

const state: StoreState = {
  sequences,
  connected: false,
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
        mesh: undefined,
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
        mesh: undefined,
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
        mesh: undefined,
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
        mesh: undefined,
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
        mesh: undefined,
        inverted: false,
        rotationAxis: 'z'
      }
    ],
    gripper: {
      name: 'gripper',
      position: 40,
      target: 40,
      enabled: true,
      min: GRIPPER_MIN_POSITION,
      max: GRIPPER_MAX_POSITION,
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
  home() {
    this.state.arm.joints.forEach(x => (x.target = 0))
    this.state.arm.gripper.target = GRIPPER_MIN_POSITION
  },
  getJointsAttribute(attribute: string): JointsAttribute {
    return this.state.arm.joints.reduce((curr: any, acc: any) => {
      curr[acc.name] = parseFloat(acc[attribute])
      return curr
    }, {})
  },
  getJointByName(name: string): Joint | undefined {
    return this.state.arm.joints.find(x => x.name === name)
  },
  parsePositionFromMessageRow(messageRow: MessageRow): JointPosition[] {
    const splitted = messageRow.split(' ')
    if (splitted[0] !== 'G0') return []
    const positions: JointPosition[] = [
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
  setTargetPositions(positions: JointPosition[]) {
    this.getJointByName('base')!.target = positions[0].value
    this.getJointByName('shoulder')!.target = positions[1].value
    this.getJointByName('elbow')!.target = positions[2].value
    this.getJointByName('wristRotate')!.target = positions[3].value
    this.getJointByName('wrist')!.target = positions[4].value
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
    this.state.arm.gripper.target = position
  },
  parseSpeedsFromMessageRow(messageRow: MessageRow): JointSpeed[] {
    const splitted = messageRow.split(' ')
    const speeds: JointSpeed[] = [
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
  setSpeeds(speeds: JointSpeed[]) {
    this.getJointByName('base')!.speed = speeds[0].value
    this.getJointByName('shoulder')!.speed = speeds[1].value
    this.getJointByName('elbow')!.speed = speeds[2].value
    this.getJointByName('wristRotate')!.speed = speeds[3].value
    this.getJointByName('wrist')!.speed = speeds[4].value
  },
  parseAccelerationsFromMessageRow(
    messageRow: MessageRow
  ): JointAcceleration[] {
    const splitted = messageRow.split(' ')
    const accelerations: JointAcceleration[] = [
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
  setAccelerations(accelerations: JointAcceleration[]) {
    this.getJointByName('base')!.acceleration = accelerations[0].value
    this.getJointByName('shoulder')!.acceleration = accelerations[1].value
    this.getJointByName('elbow')!.acceleration = accelerations[2].value
    this.getJointByName('wristRotate')!.acceleration = accelerations[3].value
    this.getJointByName('wrist')!.acceleration = accelerations[4].value
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
