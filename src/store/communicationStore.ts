import joints from '@/assets/joints'
import { Commands } from '@/constants/Commands'
import { SerialMessage } from '@/constants/SerialMessage'
import { EventType } from '@/constants/types/EventType'
import { WebsocketMessage } from '@/constants/WebsocketMessage'
import eb from '@/EventBus'

const hostname = 'roborukapi4'
let ws: WebSocket | null = null

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

export interface CommunicationStore {
  parseJointsData(
    message: Message,
    dataType: SerialMessage
  ): JointMessageData[] | undefined
  parseGripper(message: Message): GripperMessageData | undefined
  parseSyncMotors(message: Message): boolean | undefined
  getMessageRow(message: string, type: SerialMessage): MessageRow | undefined
  connect(): void
  disconnect(): void
  sendCommand(command: Command): void
}

export const communicationStore: CommunicationStore = {
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
  },
  connect() {
    ws = new WebSocket(`ws://${hostname}:1337`)
    ws.onmessage = event => eb.emit(EventType.WS_MESSAGE_RECEIVED, event.data)
    ws.onopen = () => {
      this.sendCommand(WebsocketMessage.WS_CONNECT)
      this.sendCommand(Commands.STATUS)
    }
  },
  disconnect() {
    this.sendCommand(WebsocketMessage.WS_DISCONNECT)
    ws?.close()
    ws = null
  },
  sendCommand(command: Command) {
    eb.emit(EventType.WS_MESSAGE_SEND, command)
    ws?.send(command)
  }
}
