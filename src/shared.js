const hostname = 'roborukapi4'
// window.location.hostname === 'ezpzlmnsqz1337.eu'
//   ? 'ezpzlmnsqz1337.eu'
//   : 'rolety'

const ws = new WebSocket(`ws://${hostname}:1337`)
// const ws = new WebSocket("ws://" + window.location.hostname + ":8085");
// const ws = new WebSocket('ws://' + window.location.hostname)
export default ws
