/**
 * Player definition
 */

import THREE from 'three'

export default class Player extends THREE.Mesh {
  constructor (game, position) {
    var geometry = new THREE.BoxGeometry(5, 5, 5)
    var material = new THREE.MeshLambertMaterial({ color: 0xFF0000 })
    super(geometry, material)

    this.onAction = this.onAction.bind(this)
    this.onTick = this.onTick.bind(this)

    this.game = game
    game.on('action', this.onAction)
    game.scene.add(this)

    // this.position.set(position || new THREE.Vector3(0, 0, 0))

    game.camera.addTarget({
      name: 'player',
      targetObject: this,
      cameraPosition: new THREE.Vector3(0, 30, 50),
      fixed: false,
      stiffness: 0.01,
      matchRotation: false
    })
    game.camera.setTarget('player')

    this.velocity = [0, 0]

    game.on('tick', this.onTick)
  }

  onAction (action) {
    // console.log('action!', action.type, action.value)
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
