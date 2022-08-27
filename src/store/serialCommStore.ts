import { SerialMessage } from '@/constants/SerialMessage'
import joints from '@/assets/joints'
import { Commands } from '@/constants/Commands'

export type Message = string
export type MessageRow = string
export type Command = string

export interface GripperMessageData {
  target: number
  enabled: boolean
}

export interface JointMessageData {
  name: string
  value: number
}

export interface SerialCommStore {
  parseJointsData(
    message: Message,
    dataType: SerialMessage
  ): JointMessageData[] | undefined
  parseGripper(message: Message): GripperMessageData | undefined
  parseSyncMotors(message: Message): boolean | undefined
  getMessageRow(message: string, type: SerialMessage): MessageRow | undefined
}

export const serialCommStore: SerialCommStore = {
  parseJointsData(message: Message, dataType: SerialMessage) {
    const messageRow = this.getMessageRow(message, dataType)
    if (!messageRow) return

    const jointNames = joints.map(x => x.name)

    const parts = messageRow.split(' ')
    const positions = jointNames.map((name, index) => ({
      name,
      value: parseInt(parts[index + 1].replace(/[^0-9-]/g, ''))
    })) as JointMessageData[]

    return positions
  },
  parseGripper(message: Message) {
    const messageRow = this.getMessageRow(message, SerialMessage.GRIPPER)
    if (!messageRow) return

    const parts = messageRow.split(' ')
    const enabled = parseInt(parts[1].replace(/[^0-9-]/g, '')) === 1
    const gripper = {
      enabled,
      target: parseInt(parts[2].substring(1))
    } as GripperMessageData
    return gripper
  },
  parseSyncMotors(message: Message) {
    const messageRow = this.getMessageRow(message, SerialMessage.SYNC_MOTORS)
    if (!messageRow) return

    return parseInt(messageRow.split(' ')[1]) === 1
  },
  getMessageRow(message: string, type: SerialMessage) {
    return message
      .split('\n')
      .filter(x => x.includes(type))
      .pop()
  }
}
