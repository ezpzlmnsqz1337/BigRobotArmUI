import { EventType } from './constants/types/EventType'
import eb from './EventBus'

const hostname = 'roborukapi4'

const ws = new WebSocket(`ws://${hostname}:1337`)
ws.onmessage = event => eb.emit(EventType.WS_MESSAGE_RECEIVED, event.data)

// const ws = new WebSocket("ws://" + window.location.hostname + ":8085");
// const ws = new WebSocket('ws://' + window.location.hostname)
export default ws
