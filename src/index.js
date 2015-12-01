/**
 * Basic engine setup
 */
/* global responsiveVoice */

import { polyfill } from 'es6-promise'
polyfill()

responsiveVoice.OnVoiceReady = () => {
  responsiveVoice.ready = true
}

import Game from './Game'

const game = new Game()
export default game
