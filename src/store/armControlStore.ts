import { GRIPPER_MIN_POSITION } from '@/assets/config'
import gripper from '@/assets/gripper'
import joints, { Gripper, Joint } from '@/assets/joints'
import { Commands } from '@/constants/Commands'
import { Command, JointMessageData } from './serialCommStore'

export interface RobotArmData {
  joints: Joint[]
  gripper: Gripper
  preview: boolean
  syncMotors: boolean
  isReady: boolean
}

export interface ArmControlStore {
  arm: RobotArmData
  home(): void
  busy(): void
  ready(): void
  getJoints(): Joint[]
  getJointByName(name: string): Joint | undefined
  setTargetPositions(positions: JointMessageData[]): void
  setGripperEnabled(enabled: boolean): void
  setGripperTargetPosition(position: number): void
  setSpeeds(speeds: JointMessageData[]): void
  setAccelerations(accelerations: JointMessageData[]): void
  setSyncMotors(syncMotors: boolean): void
  createPositionCommand(): Command
  createSpeedCommand(): Command
  createAccelerationCommand(): Command
}

export const armControlStore: ArmControlStore = {
  arm: {
    joints,
    gripper,
    preview: false,
    syncMotors: false,
    isReady: false
  },
  home() {
    this.arm.joints.forEach(x => (x.position.target = 0))
    this.arm.gripper.position.target = GRIPPER_MIN_POSITION
  },
  busy() {
    this.arm.isReady = false
  },
  ready() {
    this.arm.isReady = true
  },
  setSyncMotors(syncMotors: boolean) {
    this.arm.syncMotors = syncMotors
  },
  getJoints() {
    return this.arm.joints
  },
  getJointByName(name: string): Joint | undefined {
    return this.arm.joints.find(x => x.name === name)
  },
  setGripperEnabled(enabled: boolean) {
    this.arm.gripper.enabled = enabled
  },
  setGripperTargetPosition(position: number) {
    this.arm.gripper.position.target = position
  },
  setTargetPositions(positions: JointMessageData[]) {
    this.arm.joints.forEach((joint, index) => {
      joint.position.target = positions[index].value
    })
  },
  setSpeeds(speeds: JointMessageData[]) {
    this.arm.joints.forEach((joint, index) => {
      joint.speed.value = speeds[index].value
    })
  },
  setAccelerations(accelerations: JointMessageData[]) {
    this.arm.joints.forEach((joint, index) => {
      joint.acceleration.value = accelerations[index].value
    })
  },
  createPositionCommand() {
    const p = this.arm.joints.map(x => `${x.code}${x.position.target}`)
    return `${Commands.GO_TO} ${p.join(' ')}`
  },
  createSpeedCommand() {
    const p = this.arm.joints.map(x => `${x.code}${x.speed.value}`)
    return `${Commands.SET_SPEEDS} ${p.join(' ')}`
  },
  createAccelerationCommand() {
    const p = this.arm.joints.map(x => `${x.code}${x.acceleration.value}`)
    return `${Commands.SET_ACCELERATIONS} ${p.join(' ')}`
  }
}
