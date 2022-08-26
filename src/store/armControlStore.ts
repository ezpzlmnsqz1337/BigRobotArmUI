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
import { Object3D } from 'three'
import {
  JointAccelerationInfo,
  JointPositionInfo,
  JointSpeedInfo
} from './serialCommStore'

export interface RobotArmData {
  joints: Joint[]
  gripper: Gripper
  preview: boolean
  syncMotors: boolean
  isReady: boolean
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

export interface JointsAttribute {
  base?: number | string | boolean
  shoulder?: number | string | boolean
  elbow?: number | string | boolean
  wristRotate?: number | string | boolean
  wrist?: number | string | boolean
}

export interface ArmControlStore {
  arm: RobotArmData
  home(): void
  getJointsAttribute(attribute: string, key?: string): JointsAttribute
  getJointByName(name: string): Joint | undefined
  setTargetPositions(positions: JointPositionInfo[]): void
  setGripperEnabled(enabled: boolean): void
  setGripperTargetPosition(position: number): void
  setSpeeds(speeds: JointSpeedInfo[]): void
  setAccelerations(accelerations: JointAccelerationInfo[]): void
  setSyncMotors(syncMotors: boolean): void
  busy(): void
  ready(): void
}

export const armControlStore: ArmControlStore = {
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
    isReady: false
  },
  home() {
    this.arm.joints.forEach(x => (x.position.target = 0))
    this.arm.gripper.position.target = GRIPPER_MIN_POSITION
  },
  getJointsAttribute(attribute: string, key?: string): JointsAttribute {
    return this.arm.joints.reduce((curr: any, acc: any) => {
      const value = key ? acc[attribute][key] : acc[attribute]
      curr[acc.name] = parseFloat(value)
      return curr
    }, {})
  },
  getJointByName(name: string): Joint | undefined {
    return this.arm.joints.find(x => x.name === name)
  },
  setTargetPositions(positions: JointPositionInfo[]) {
    this.getJointByName('base')!.position.target = positions[0].value
    this.getJointByName('shoulder')!.position.target = positions[1].value
    this.getJointByName('elbow')!.position.target = positions[2].value
    this.getJointByName('wristRotate')!.position.target = positions[3].value
    this.getJointByName('wrist')!.position.target = positions[4].value
  },
  setGripperEnabled(enabled: boolean) {
    this.arm.gripper.enabled = enabled
  },
  setGripperTargetPosition(position: number) {
    this.arm.gripper.position.target = position
  },
  setSpeeds(speeds: JointSpeedInfo[]) {
    this.getJointByName('base')!.speed.value = speeds[0].value
    this.getJointByName('shoulder')!.speed.value = speeds[1].value
    this.getJointByName('elbow')!.speed.value = speeds[2].value
    this.getJointByName('wristRotate')!.speed.value = speeds[3].value
    this.getJointByName('wrist')!.speed.value = speeds[4].value
  },
  setAccelerations(accelerations: JointAccelerationInfo[]) {
    this.getJointByName('base')!.acceleration.value = accelerations[0].value
    this.getJointByName('shoulder')!.acceleration.value = accelerations[1].value
    this.getJointByName('elbow')!.acceleration.value = accelerations[2].value
    this.getJointByName('wristRotate')!.acceleration.value =
      accelerations[3].value
    this.getJointByName('wrist')!.acceleration.value = accelerations[4].value
  },
  setSyncMotors(syncMotors: boolean) {
    this.arm.syncMotors = syncMotors
  },
  busy() {
    this.arm.isReady = false
  },
  ready() {
    this.arm.isReady = true
  }
}
