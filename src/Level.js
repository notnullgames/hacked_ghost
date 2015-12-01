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

  destructor () {}
}
