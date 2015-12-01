/**
 * Player definition
 */

import THREE from 'three'

export default class Player extends THREE.Mesh {
  constructor () {
    var geometry = new THREE.BoxGeometry(5, 5, 5)
    var material = new THREE.MeshLambertMaterial({ color: 0xca32c8 })
    super(geometry, material)

    this.onAction = this.onAction.bind(this)
    this.onTick = this.onTick.bind(this)
    this.velocity = [0, 0]
  }

  onAction (action) {
    if (action.value) {
      if (action.type === 'north') {
        this.velocity[1] = -1
      }else if (action.type === 'south') {
        this.velocity[1] = 1
      }else if (action.type === 'east') {
        this.velocity[0] = 1
      }else if (action.type === 'west') {
        this.velocity[0] = -1
      }
    }else {
      if (action.type === 'north') {
        this.velocity[1] = 0
      }else if (action.type === 'south') {
        this.velocity[1] = 0
      }else if (action.type === 'east') {
        this.velocity[0] = 0
      }else if (action.type === 'west') {
        this.velocity[0] = 0
      }
    }
  }

  onTick (dt) {
    this.position.x += (this.velocity[0])
    this.position.z += (this.velocity[1])
  }
}
