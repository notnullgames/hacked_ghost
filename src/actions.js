/**
 * Key/joystick to action mapping
 * @variable actions
 * @type {Object}
 */
const actions = {
  'north': [
    {'type': 'key', 'key': 87},
    {'type': 'key', 'key': 38},
    {'type': 'axis', 'axis': 1, 'direction': -1}
  ],
  'south': [
    {'type': 'key', 'key': 83},
    {'type': 'key', 'key': 40},
    {'type': 'axis', 'axis': 1, 'direction': 1}
  ],
  'west': [
    {'type': 'key', 'key': 65},
    {'type': 'key', 'key': 37},
    {'type': 'axis', 'axis': 0, 'direction': -1}
  ],
  'east': [
    {'type': 'key', 'key': 68},
    {'type': 'key', 'key': 39},
    {'type': 'axis', 'axis': 0, 'direction': 1}
  ]
}
export default actions
