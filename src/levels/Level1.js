import THREE from 'three'
import Level from '../Level'

export default class Level1 extends Level {
  constructor (game) {
    super(game)

    var light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 100, 0)
    this.game.scene.add(light)
    var sky = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture('assets/universe.jpg'),
      side: THREE.BackSide
    })
    this.game.scene.add(new THREE.Mesh(new THREE.SphereGeometry(2000, 32, 32), sky))
    this.game.scene.add(new THREE.GridHelper(400, 10))
  }

  onTick (dt) {}

  destructor () {}
}
