export enum EventType {
  WS_MESSAGE_RECEIVED = 'ws-message-received',
  WS_MESSAGE_SEND = 'ws-message-send',
  // arm events
  ARM_IN_POSITION = 'arm-in-position',
  SET_PREVIEW_SPEED = 'arm-set-preview-speed',
  CENTER_CAMERA = 'center-camera',
  ARM_MODEL_LOADED = 'arm-model-loaded',
  ARM_MODEL_LOADING_PROGRESS = 'arm-model-loading-progress',
  ARM_MODEL_LOADED_ERROR = 'arm-model-loaded-error',
  // window events
  WINDOW_RESIZE = 'resize'
}
