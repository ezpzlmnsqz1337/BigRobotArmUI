import joints from '@/assets/joints'
import { Commands } from '@/constants/Commands'
import { SerialMessage } from '@/constants/SerialMessage'
import { EventType } from '@/constants/types/EventType'
import { WebsocketMessage } from '@/constants/WebsocketMessage'
import eb from '@/EventBus'
import { connectionStore } from './connectionStore'

const JOINT_VALUE_PATTERN = /^([A-Za-z]+)(-?\d+)$/
const GRIPPER_ENABLED_PATTERN = /^E(-?\d+)$/
const GRIPPER_TARGET_PATTERN = /^P(-?\d+)$/

let ws: WebSocket | null = null

export type Message = string
export type MessageRow = string
export type Command = string

export interface ServerJobStatus {
  jobId: string
  name: string
  status: string
  currentIndex: number
  total: number
  lastResponse?: string | null
  error?: string | null
  cancelRequested?: boolean
}

export interface ServerEvent {
  type: string
  message?: string
  jobId?: string
  job?: ServerJobStatus | null
  jobs?: ServerJobStatus[]
}

export interface JobPayload {
  type: 'submitJob'
  job: {
    name: string
    commands: Command[]
  }
}

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
  parseServerEvent(message: Message): ServerEvent | undefined
  getMessageRow(message: string, type: SerialMessage): MessageRow | undefined
  connect(): void
  disconnect(): void
  sendCommand(command: Command): boolean
  sendJob(name: string, commands: Command[]): void
  requestQueueStatus(): void
}

function findPatternValue(parts: string[], pattern: RegExp) {
  for (const part of parts) {
    const match = pattern.exec(part)
    if (match) return match[1]
  }

  return undefined
}

function sendRaw(message: string) {
  // WebSocket.OPEN is 1. Use the numeric value so the check also works with
  // mocked WebSocket implementations that do not expose static constants.
  if (!ws || ws.readyState !== 1) return false

  try {
    ws.send(message)
    return true
  } catch {
    return false
  }
}

function closeSocket() {
  if (!ws) return

  ws.onopen = null
  ws.onmessage = null
  ws.onerror = null
  ws.onclose = null
  ws.close()
  ws = null
}

function handleSocketFailure(message: string) {
  connectionStore.stopConnecting()
  connectionStore.setConnectionStatus(false)
  connectionStore.setError(message)
  closeSocket()
}

export const communicationStore: CommunicationStore = {
  parseJointsData(message: Message, dataType: SerialMessage) {
    const messageRow = this.getMessageRow(message, dataType)
    if (!messageRow) return

    const valuesByCode = new Map<string, number>()
    messageRow.split(/\s+/).forEach(part => {
      const match = JOINT_VALUE_PATTERN.exec(part)
      if (!match) return

      valuesByCode.set(match[1].toUpperCase(), parseInt(match[2], 10))
    })

    const positions: JointMessageData[] = []
    for (const joint of joints) {
      const value = valuesByCode.get(joint.code)
      if (value === undefined || Number.isNaN(value)) return

      positions.push({ name: joint.name, value })
    }

    return positions
  },
  parseGripper(message: Message) {
    const messageRow = this.getMessageRow(message, SerialMessage.GRIPPER)
    if (!messageRow) return

    const parts = messageRow.split(/\s+/)
    const enabledValue = findPatternValue(parts, GRIPPER_ENABLED_PATTERN)
    const targetValue = findPatternValue(parts, GRIPPER_TARGET_PATTERN)
    if (enabledValue === undefined || targetValue === undefined) return

    const enabled = parseInt(enabledValue, 10)
    const target = parseInt(targetValue, 10)
    if (Number.isNaN(enabled) || Number.isNaN(target)) return

    return {
      enabled: enabled === 1,
      target
    }
  },
  parseSyncMotors(message: Message) {
    const messageRow = this.getMessageRow(message, SerialMessage.SYNC_MOTORS)
    if (!messageRow) return

    const value = parseInt(messageRow.split(/\s+/)[1], 10)
    if (Number.isNaN(value)) return

    return value === 1
  },
  parseServerEvent(message: Message) {
    const trimmed = message.trim()
    if (!trimmed.startsWith('{')) return

    try {
      const parsed = JSON.parse(trimmed) as ServerEvent
      return typeof parsed.type === 'string' ? parsed : undefined
    } catch {
      return
    }
  },
  getMessageRow(message: string, type: SerialMessage) {
    return message
      .split('\n')
      .filter(x => x.includes(type))
      .pop()
  },
  connect() {
    closeSocket()
    connectionStore.setError(null)

    const socket = new WebSocket(`ws://${window.location.hostname}:1337`)
    ws = socket

    socket.onmessage = event =>
      eb.emit(EventType.WS_MESSAGE_RECEIVED, event.data)
    socket.onopen = () => {
      connectionStore.setError(null)
      this.sendCommand(WebsocketMessage.WS_CONNECT)
      this.sendCommand(Commands.STATUS)
      this.requestQueueStatus()
    }
    socket.onerror = () =>
      handleSocketFailure('Could not reach the robot arm server')
    socket.onclose = () =>
      handleSocketFailure('Connection to the robot arm server was closed')
  },
  disconnect() {
    this.sendCommand(WebsocketMessage.WS_DISCONNECT)
    closeSocket()
  },
  sendCommand(command: Command) {
    eb.emit(EventType.WS_MESSAGE_SEND, command)
    return sendRaw(command)
  },
  sendJob(name: string, commands: Command[]) {
    const payload: JobPayload = {
      type: 'submitJob',
      job: {
        name,
        commands
      }
    }
    const serialized = JSON.stringify(payload)
    eb.emit(EventType.WS_MESSAGE_SEND, serialized)
    sendRaw(serialized)
  },
  requestQueueStatus() {
    const payload = JSON.stringify({ type: 'getQueueStatus' })
    eb.emit(EventType.WS_MESSAGE_SEND, payload)
    sendRaw(payload)
  }
}
