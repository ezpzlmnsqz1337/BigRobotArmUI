import { GRIPPER_MAX_POSITION, GRIPPER_MIN_POSITION } from '@/assets/config'

export default {
  name: 'gripper',
  position: {
    value: 40,
    min: GRIPPER_MIN_POSITION,
    max: GRIPPER_MAX_POSITION,
    target: 40
  },
  enabled: true,
  mesh: null
}
