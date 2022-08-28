import { connectionStore } from '@/store/connectionStore'

describe('ConnectionStore', () => {
  beforeEach(() => {
    connectionStore.connected = false
    connectionStore.isConnecting = false
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

  it('should set "connected" variable based on given parameter', () => {
    connectionStore.setConnectionStatus(true)
    expect(connectionStore.connected).toBe(true)

    connectionStore.setConnectionStatus(false)
    expect(connectionStore.connected).toBe(false)
  })
})
