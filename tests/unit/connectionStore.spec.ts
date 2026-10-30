import { connectionStore } from '@/store/connectionStore'

describe('ConnectionStore', () => {
  beforeEach(() => {
    connectionStore.connected = false
    connectionStore.isConnecting = false
    connectionStore.error = null
  })

  it('should set isConnecting to true', () => {
    connectionStore.startConnecting()
    expect(connectionStore.isConnecting).toBe(true)
  })

  it('should set isConnecting to false', () => {
    connectionStore.isConnecting = true
    connectionStore.stopConnecting()
    expect(connectionStore.isConnecting).toBe(false)
  })

  it('should set or clear the connection error', () => {
    connectionStore.setError('Could not connect')
    expect(connectionStore.error).toBe('Could not connect')

    connectionStore.setError(null)
    expect(connectionStore.error).toBeNull()
  })

  it('should set "connected" variable based on given parameter', () => {
    connectionStore.setConnectionStatus(true)
    expect(connectionStore.connected).toBe(true)

    connectionStore.setConnectionStatus(false)
    expect(connectionStore.connected).toBe(false)
  })
})
