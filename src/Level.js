/**
 * Generic level definition, this should be extended
 */
import emitonoff from 'emitonoff'

export default class Level {
  constructor (game) {
    this.onTick = this.onTick.bind(this)
    this.game = game
    game.on('tick', this.onTick)
    emitonoff(this)
  }

  onTick (dt) {}

  destructor () {
    this.game.off('tick', this.onTick)
    for (var i = this.game.scene.children.length - 1; i >= 0; i--) {
      this.game.scene.remove(this.game.scene.children[i])
    }
  }
}
