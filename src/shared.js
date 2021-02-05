const hostname = 'roborukapi4'

const TESTING = true // set this to false to enable WS

const ws = TESTING ? null : new WebSocket(`ws://${hostname}:1337`)

// const ws = new WebSocket("ws://" + window.location.hostname + ":8085");
// const ws = new WebSocket('ws://' + window.location.hostname)
export default ws
