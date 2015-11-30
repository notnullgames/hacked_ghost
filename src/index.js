/**
 * Basic engine setup
 */
import { polyfill } from 'es6-promise'
polyfill()

import Game from './Game'

const game = new Game()
export default game
