/**
 * Key/joystick to action mapping
 * @variable actions
 * @type {Object}
 */
const actions = {
  'north': [
    {type: 'key', key: 87, name: 'W'},
    {type: 'key', key: 38, name: 'up'},
    {type: 'axis', axis: 1, direction: -1}
  ],
  'south': [
    {type: 'key', key: 83, name: 'S'},
    {type: 'key', key: 40, name: 'down'},
    {type: 'axis', axis: 1, direction: 1}
  ],
  'west': [
    {type: 'key', key: 65, name: 'A'},
    {type: 'key', key: 37, name: 'left'},
    {type: 'axis', axis: 0, direction: -1}
  ],
  'east': [
    {type: 'key', key: 68, name: 'D'},
    {type: 'key', key: 39, name: 'right'},
    {type: 'axis', axis: 0, direction: 1}
  ],
  'instruct': [
    {type: 'key', key: 73, name: 'I'}
  ],
  'fullscreen': [
    {type: 'key', key: 70, name: 'F'}
  ]
}
export default actions
