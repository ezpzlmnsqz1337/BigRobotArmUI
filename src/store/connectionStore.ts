export interface ConnectionStore {
  connected: boolean
  isConnecting: boolean
  error: string | null
  setConnectionStatus(status: boolean): void
  setError(message: string | null): void
  startConnecting(): void
  stopConnecting(): void
}

export const connectionStore: ConnectionStore = {
  connected: false,
  isConnecting: false,
  error: null,
  setConnectionStatus(status: boolean) {
    this.connected = status
  },
  setError(message: string | null) {
    this.error = message
  },
  startConnecting() {
    this.isConnecting = true
  },
  stopConnecting() {
    this.isConnecting = false
  }
}
