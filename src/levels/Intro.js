import THREE from 'three'
import Text from '../Text'
import Level from '../Level'
import Music from '../Music'

import Level1 from './Level1'

import {} from '../droid_sans_bold.typeface.js'

export default class Intro extends Level {
  constructor (game) {
    super(game)
    this.onAction = this.onAction.bind(this)
    this.game.on('action', this.onAction)
    this.oldPosition = this.game.player.matrixWorld.getPosition()
    this.game.player.visible = false

    this.music = new Music('t*t/(t>>12&t>>8&63)<<7', true, 4000, 45)
    this.music.volume = 0.5

    const sayHello = () => {
      this.game.say('not null games')
        .then(() => {
          this.music.play()
        })
        .catch((reason) => {
          if (reason === 'not ready') {
            setTimeout(sayHello)
          }
        })
    }
    sayHello()

    var mesh = new Text('notnull')
    mesh.scale.multiplyScalar(4)
    mesh.position.y = 3.5
    this.game.scene.add(mesh)
    mesh = new Text('games')
    mesh.scale.multiplyScalar(2)
    this.game.scene.add(mesh)

    this.showTitle = false
  }

  onTick (dt) {
    // ignore position changes
    this.game.player.position.copy(this.oldPosition)
  }

  onAction (action) {
    if (this.showTitle) {
      this.game.load(Level1)
    } else {
      this.oldPosition = new THREE.Vector3(200, 0, 0)
      var mesh = new Text('hacked_ghost')
      mesh.scale.multiplyScalar(4)
      mesh.position.copy(this.oldPosition)
      this.game.scene.add(mesh)
      this.game.say('hacked ghost.')
        .then(() => {
          this.showTitle = true
        })
    }
  }

  destructor () {
    this.music.pause()
    this.game.off('action', this.onAction)
    this.game.player.visible = true
    super.destructor()
  }
}
