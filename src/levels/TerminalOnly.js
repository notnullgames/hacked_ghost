import Level from '../Level'
import DataTerminal from '../DataTerminal'

export default class TerminalOnly extends Level {
  constructor (game) {
    super(game)
    this.terminal = new DataTerminal(this.game)
    this.terminal.name = 'demo'
    this.game.collidables.push(this.terminal)
    this.game.scene.add(this.terminal)
    this.terminal.open()
  }

  onTick (dt) {}

  destructor () {
  }
}

TerminalOnly.noPlayer = true
