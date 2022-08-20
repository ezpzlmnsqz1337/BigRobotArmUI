const hostname = 'roborukapi4'

const ws = new WebSocket(`ws://${hostname}:1337`)

// const ws = new WebSocket("ws://" + window.location.hostname + ":8085");
// const ws = new WebSocket('ws://' + window.location.hostname)
export default ws
