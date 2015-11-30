/**
 * Generic level definition, this should be extended
 */
export default class Level {
  constructor (game) {
    this.game = game
    game.on('tick', this.onTick.bind(this))
  }
  onTick (dt) {}
  destructor () {}
}
