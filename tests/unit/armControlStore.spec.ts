import { GRIPPER_MIN_POSITION } from '@/assets/config'
import joints from '@/assets/joints'
import { armControlStore } from '@/store/armControlStore'
import { JointMessageData } from '@/store/communicationStore'

describe('ArmControlStore', () => {
  it('should set isReady to true when ready() is called', () => {
    armControlStore.arm.isReady = false
    armControlStore.ready()

    expect(armControlStore.arm.isReady).toBe(true)
  })

  it('should set isReady to false when busy() is called', () => {
    armControlStore.arm.isReady = true
    armControlStore.busy()

    expect(armControlStore.arm.isReady).toBe(false)
  })

  it('should set syncMotors to given value', () => {
    armControlStore.setSyncMotors(true)
    expect(armControlStore.arm.syncMotors).toBe(true)

    armControlStore.setSyncMotors(false)
    expect(armControlStore.arm.syncMotors).toBe(false)
  })

  it('should get arm joints', () => {
    expect(armControlStore.getJoints()).toStrictEqual(joints)
  })

  it('should get arm joint by name', () => {
    armControlStore.arm.joints.forEach(x =>
      expect(armControlStore.getJointByName(x.name)).toStrictEqual(x)
    )
  })

  it('should set gripper enabled based on parameter', () => {
    armControlStore.setGripperEnabled(true)
    expect(armControlStore.arm.gripper.enabled).toBe(true)

    armControlStore.setGripperEnabled(false)
    expect(armControlStore.arm.gripper.enabled).toBe(false)
  })

  it('should set gripper target position', () => {
    armControlStore.setGripperTargetPosition(69)
    expect(armControlStore.arm.gripper.position.target).toBe(69)
  })

  it('should set gripper value position', () => {
    armControlStore.setGripperValuePosition(69)
    expect(armControlStore.arm.gripper.position.value).toBe(69)
  })

  it('should set joints target positions', () => {
    const targetPositions = armControlStore.arm.joints.map(({ name }) => ({
      name,
      value: 420
    }))
    armControlStore.setTargetPositions(targetPositions)

    armControlStore.arm.joints.forEach(x => expect(x.position.target).toBe(420))
  })

  it('should set joints value positions', () => {
    const valuePositions = armControlStore.arm.joints.map(({ name }) => ({
      name,
      value: 420
    }))
    armControlStore.setValuePositions(valuePositions)

    armControlStore.arm.joints.forEach(x => expect(x.position.value).toBe(420))
  })

  it('should set joints speeds', () => {
    const targetSpeeds = armControlStore.arm.joints.map(({ name }) => ({
      name,
      value: 69
    }))
    armControlStore.setSpeeds(targetSpeeds)

    armControlStore.arm.joints.forEach(x => expect(x.speed.value).toBe(69))
  })

  it('should set joints accelerations', () => {
    const targetAccelerations = armControlStore.arm.joints.map(({ name }) => ({
      name,
      value: 123
    }))
    armControlStore.setAccelerations(targetAccelerations)

    armControlStore.arm.joints.forEach(x =>
      expect(x.acceleration.value).toBe(123)
    )
  })

  it('should set joint positions to zero and gripper to min position when home() is called', () => {
    armControlStore.home()

    armControlStore.arm.joints.forEach(x => {
      expect(x.position.target).toBe(0)
    })
    expect(armControlStore.arm.gripper.position.target).toBe(
      GRIPPER_MIN_POSITION
    )
  })
})
