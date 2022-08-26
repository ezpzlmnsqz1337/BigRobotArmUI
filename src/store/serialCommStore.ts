export type Message = string
export type MessageRow = string
export type Command = string

export interface GripperMessageData {
  target: number
  enabled: boolean
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

export interface SerialCommStore {
  parsePositionFromMessageRow(messageRow: MessageRow): JointPositionInfo[]
  parseGripperFromMessageRow(messageRow: MessageRow): GripperMessageData
  parseSpeedsFromMessageRow(messageRow: MessageRow): JointSpeedInfo[]
  parseAccelerationsFromMessageRow(
    messageRow: MessageRow
  ): JointAccelerationInfo[]
  parseSyncMotorsFromMessageRow(messageRow: MessageRow): boolean
}

export const serialCommStore: SerialCommStore = {
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
  parseGripperFromMessageRow(messageRow: MessageRow): GripperMessageData {
    const splitted = messageRow.split(' ')
    const enabled = parseInt(splitted[1].substring(1)) == 1 ? true : false
    const gripper = {
      enabled,
      target: parseInt(splitted[2].substring(1))
    }
    return gripper
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
  parseSyncMotorsFromMessageRow(messageRow: MessageRow): boolean {
    return parseInt(messageRow.split(' ')[1]) == 1 ? true : false
  }
}
