import {
  BASE_MAX_STEPS,
  BASE_MIN_STEPS,
  BASE_STEPS_PER_DEGREE,
  ELBOW_MAX_STEPS,
  ELBOW_MIN_STEPS,
  ELBOW_STEPS_PER_DEGREE,
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

export interface Joint {
  name: string
  code: string
  position: JointPosition
  speed: JointSpeed
  acceleration: JointAcceleration
  stepsPerDegree: number
  meshId: string
  mesh?: Object3D | null
  inverted: boolean
  rotationAxis: string
}

export interface Gripper {
  name: string
  position: GripperPosition
  enabled: boolean
  mesh: any
}

export interface NumberRangeData {
  value: number
  min: number
  max: number
}

export interface NumberRangeDataWithTarget extends NumberRangeData {
  target: number
}

export interface GripperPosition extends NumberRangeDataWithTarget {}
export interface JointPosition extends NumberRangeDataWithTarget {}
export interface JointSpeed extends NumberRangeData {}
export interface JointAcceleration extends NumberRangeData {}

export default [
  {
    name: 'base',
    code: 'B',
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
    meshId: 'ShaftBase',
    mesh: null,
    inverted: false,
    rotationAxis: 'y'
  },
  {
    name: 'shoulder',
    code: 'S',
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
    meshId: 'ShaftShoulder',
    mesh: null,
    inverted: true,
    rotationAxis: 'z'
  },
  {
    name: 'elbow',
    code: 'E',
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
    meshId: 'ShaftElbow',
    mesh: null,
    inverted: true,
    rotationAxis: 'z'
  },
  {
    name: 'wristRotate',
    code: 'WR',
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
    meshId: 'ShaftWristRotate',
    mesh: null,
    inverted: true,
    rotationAxis: 'y'
  },
  {
    name: 'wrist',
    code: 'W',
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
    meshId: 'ShaftWrist',
    mesh: null,
    inverted: false,
    rotationAxis: 'z'
  }
] as Joint[]
