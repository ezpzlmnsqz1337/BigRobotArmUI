export interface ConnectionStore {
  connected: boolean
  isConnecting: boolean
  setConnectionStatus(status: boolean): void
  startConnecting(): void
  stopConnecting(): void
}

export const connectionStore: ConnectionStore = {
  connected: false,
  isConnecting: false,
  setConnectionStatus(status: boolean) {
    this.connected = status
  },
  startConnecting() {
    this.isConnecting = true
  },
  stopConnecting() {
    this.isConnecting = false
  }
}
