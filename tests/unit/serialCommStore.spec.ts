import { SerialMessage } from '@/constants/SerialMessage'
import { serialCommStore } from '@/store/serialCommStore'

describe('SerialCommStore', () => {
  const positionMessage = 'BigRobotArm::POSITION: B100 S200 E300 WR400 W500'
  const accelerationMessage =
    'BigRobotArm::ACCELERATION: B200 S100 E100 WR100 W100'
  const speedMessage = 'BigRobotArm::SPEED: B200 S100 E100 WR100 W100'
  const syncMotorsMessage = 'BigRobotArm::SYNC-MOTORS: 1'
  const gripperMessage = 'BigRobotArm::GRIPPER: E0 P90'
  const statusMessage = [
    positionMessage,
    accelerationMessage,
    speedMessage,
    syncMotorsMessage,
    gripperMessage
  ].join('\n')

  const wrongMessage = 'THIS IS WRONG MESSAGE'

  it('should get row of given serial message type from message', () => {
    ;[
      SerialMessage.POSITION,
      SerialMessage.ACCELERATION,
      SerialMessage.SPEED
    ].forEach(x =>
      expect(serialCommStore.parseJointsData(statusMessage, x)).toBeDefined()
    )
    expect(serialCommStore.parseGripper(statusMessage)).toBeDefined()
    expect(serialCommStore.parseSyncMotors(statusMessage)).toBeDefined()
  })

  it('should parse position from message', () => {
    const positions = serialCommStore.parseJointsData(
      statusMessage,
      SerialMessage.POSITION
    )
    const expected = [
      { name: 'base', value: 100 },
      { name: 'shoulder', value: 200 },
      { name: 'elbow', value: 300 },
      { name: 'wristRotate', value: 400 },
      { name: 'wrist', value: 500 }
    ]

    expected.forEach((joint, index) => {
      expect(positions![index].name).toEqual(joint.name)
      expect(positions![index].value).toEqual(joint.value)
    })
  })

  it('should parse acceleration from message', () => {
    const accelerations = serialCommStore.parseJointsData(
      statusMessage,
      SerialMessage.ACCELERATION
    )
    const expected = [
      { name: 'base', value: 200 },
      { name: 'shoulder', value: 100 },
      { name: 'elbow', value: 100 },
      { name: 'wristRotate', value: 100 },
      { name: 'wrist', value: 100 }
    ]

    expected.forEach((joint, index) => {
      expect(accelerations![index].name).toEqual(joint.name)
      expect(accelerations![index].value).toEqual(joint.value)
    })
  })

  it('should parse speed from message', () => {
    const speeds = serialCommStore.parseJointsData(
      statusMessage,
      SerialMessage.SPEED
    )
    const expected = [
      { name: 'base', value: 200 },
      { name: 'shoulder', value: 100 },
      { name: 'elbow', value: 100 },
      { name: 'wristRotate', value: 100 },
      { name: 'wrist', value: 100 }
    ]

    expected.forEach((joint, index) => {
      expect(speeds![index].name).toEqual(joint.name)
      expect(speeds![index].value).toEqual(joint.value)
    })
  })

  it('should parse gripper state from message', () => {
    const gripper = serialCommStore.parseGripper(statusMessage)

    expect(gripper?.enabled).toEqual(false)
    expect(gripper?.target).toEqual(90)
  })

  it('should parse syncMotors from message', () => {
    const syncMotors = serialCommStore.parseSyncMotors(statusMessage)

    expect(syncMotors).toEqual(true)
  })

  it('should return undefined if message does not contain wanted information', () => {
    const positions = serialCommStore.parseJointsData(
      wrongMessage,
      SerialMessage.POSITION
    )
    const accelerations = serialCommStore.parseJointsData(
      wrongMessage,
      SerialMessage.ACCELERATION
    )
    const speeds = serialCommStore.parseJointsData(
      wrongMessage,
      SerialMessage.SPEED
    )
    const gripper = serialCommStore.parseGripper(wrongMessage)
    const syncMotors = serialCommStore.parseSyncMotors(wrongMessage)

    expect(positions).toBeUndefined()
    expect(accelerations).toBeUndefined()
    expect(speeds).toBeUndefined()
    expect(gripper).toBeUndefined()
    expect(syncMotors).toBeUndefined()
  })
})
