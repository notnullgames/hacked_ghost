/**
 * DataTerminal definition
 */

import THREE from 'three'

export default class DataTerminal extends THREE.Mesh {
  constructor (name) {
    super(new THREE.SphereGeometry(1, 4, 4), new THREE.MeshLambertMaterial({ color: 0x00CC00 }))
    this.userData.name = name
  }

  onCollision () {
    console.log('collided with ' + this.userData.name)
  }
}
