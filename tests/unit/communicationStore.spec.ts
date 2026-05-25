import { SerialMessage } from '@/constants/SerialMessage'
import { communicationStore } from '@/store/communicationStore'

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
      expect(communicationStore.parseJointsData(statusMessage, x)).toBeDefined()
    )
    expect(communicationStore.parseGripper(statusMessage)).toBeDefined()
    expect(communicationStore.parseSyncMotors(statusMessage)).toBeDefined()
  })

  it('should parse position from message', () => {
    const positions = communicationStore.parseJointsData(
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
    const accelerations = communicationStore.parseJointsData(
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
    const speeds = communicationStore.parseJointsData(
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
    const gripper = communicationStore.parseGripper(statusMessage)

    expect(gripper?.enabled).toEqual(false)
    expect(gripper?.target).toEqual(90)
  })

  it('should parse syncMotors from message', () => {
    const syncMotors = communicationStore.parseSyncMotors(statusMessage)

    expect(syncMotors).toEqual(true)
  })

  it('should return undefined if message does not contain wanted information', () => {
    const positions = communicationStore.parseJointsData(
      wrongMessage,
      SerialMessage.POSITION
    )
    const accelerations = communicationStore.parseJointsData(
      wrongMessage,
      SerialMessage.ACCELERATION
    )
    const speeds = communicationStore.parseJointsData(
      wrongMessage,
      SerialMessage.SPEED
    )
    const gripper = communicationStore.parseGripper(wrongMessage)
    const syncMotors = communicationStore.parseSyncMotors(wrongMessage)

    expect(positions).toBeUndefined()
    expect(accelerations).toBeUndefined()
    expect(speeds).toBeUndefined()
    expect(gripper).toBeUndefined()
    expect(syncMotors).toBeUndefined()
  })

  it('should serialize queued jobs as submitJob messages', () => {
    const send = jest.fn()
    const webSocketMock = jest.fn().mockImplementation(() => ({
      send,
      onmessage: null,
      onopen: null
    }))
    Object.defineProperty(window, 'WebSocket', {
      writable: true,
      configurable: true,
      value: webSocketMock
    })

    communicationStore.connect()

    const instance = webSocketMock.mock.results[0].value
    instance.onopen()

    send.mockClear()
    communicationStore.sendJob('Demo path', ['G0 B0 S0 E0 WR0 W0', 'G28'])

    expect(send).toHaveBeenCalledWith(
      JSON.stringify({
        type: 'submitJob',
        job: {
          name: 'Demo path',
          commands: ['G0 B0 S0 E0 WR0 W0', 'G28']
        }
      })
    )
  })

  it('should parse queue and job JSON messages from the server', () => {
    expect(
      communicationStore.parseServerEvent(
        JSON.stringify({
          type: 'jobProgress',
          job: {
            jobId: 'job-1',
            name: 'Demo',
            status: 'running',
            currentIndex: 1,
            total: 3
          }
        })
      )
    ).toStrictEqual({
      type: 'jobProgress',
      job: {
        jobId: 'job-1',
        name: 'Demo',
        status: 'running',
        currentIndex: 1,
        total: 3
      }
    })

    expect(
      communicationStore.parseServerEvent(
        JSON.stringify({
          type: 'queueStatus',
          jobs: [
            {
              jobId: 'job-1',
              name: 'Demo',
              status: 'queued',
              currentIndex: 0,
              total: 3
            }
          ]
        })
      )
    ).toStrictEqual({
      type: 'queueStatus',
      jobs: [
        {
          jobId: 'job-1',
          name: 'Demo',
          status: 'queued',
          currentIndex: 0,
          total: 3
        }
      ]
    })
  })
})
