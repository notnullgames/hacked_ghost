/**
 * Game engine that loads levels, sets up Player, etc
 */

import THREE from 'three'
import loop from 'raf-loop'
import emitonoff from 'emitonoff'

import actions from './actions'
import TargetCamera from './TargetCamera'
import Player from './Player'
import Level1 from './levels/Level1'

/* global responsiveVoice */
const voice = 'UK English Female'
// const voice = 'UK English Male'
// const voice = 'US English Female'
// const voice = 'Arabic Male'
// const voice = 'Armenian Male'
// const voice = 'Australian Female'
// const voice = 'Brazilian Portuguese Female'
// const voice = 'Chinese Female'
// const voice = 'Czech Female'
// const voice = 'Danish Female'
// const voice = 'Deutsch Female'
// const voice = 'Dutch Female'
// const voice = 'Finnish Female'
// const voice = 'French Female'
// const voice = 'Greek Female'
// const voice = 'Hatian Creole Female'
// const voice = 'Hindi Female'
// const voice = 'Hungarian Female'
// const voice = 'Indonesian Female'
// const voice = 'Italian Female'
// const voice = 'Japanese Female'
// const voice = 'Korean Female'
// const voice = 'Latin Female'
// const voice = 'Norwegian Female'
// const voice = 'Polish Female'
// const voice = 'Portuguese Female'
// const voice = 'Romanian Male'
// const voice = 'Russian Female'
// const voice = 'Slovak Female'
// const voice = 'Spanish Female'
// const voice = 'Spanish Latin American Female'
// const voice = 'Swedish Female'
// const voice = 'Tamil Male'
// const voice = 'Thai Female'
// const voice = 'Turkish Female'
// const voice = 'Afrikaans Male'
// const voice = 'Albanian Male'
// const voice = 'Bosnian Male'
// const voice = 'Catalan Male'
// const voice = 'Croatian Male'
// const voice = 'Czech Male'
// const voice = 'Danish Male'
// const voice = 'Esperanto Male'
// const voice = 'Finnish Male'
// const voice = 'Greek Male'
// const voice = 'Hungarian Male'
// const voice = 'Icelandic Male'
// const voice = 'Latin Male'
// const voice = 'Latvian Male'
// const voice = 'Macedonian Male'
// const voice = 'Moldavian Male'
// const voice = 'Montenegrin Male'
// const voice = 'Norwegian Male'
// const voice = 'Serbian Male'
// const voice = 'Serbo-Croatian Male'
// const voice = 'Slovak Male'
// const voice = 'Swahili Male'
// const voice = 'Swedish Male'
// const voice = 'Vietnamese Male'
// const voice = 'Welsh Male'
// const voice = 'US English Male'

export default class Game {
  constructor () {
    emitonoff(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
    this.onTick = this.onTick.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onFullscreen = this.onFullscreen.bind(this)

    this.engine = loop(dt => { this.emit('tick', dt) }).start()

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 1)
    document.body.appendChild(this.renderer.domElement)

    this.fullscreenmode = false
    this.on('tick', this.onTick)
    this.on('resize', this.onResize)
    this.on('fullscreen', this.onFullscreen)

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    window.addEventListener('resize', () => {
      this.emit('resize', {width: window.innerWidth, height: window.innerHeight})
    }, false)

    this.scene = new THREE.Scene()
    this.camera = new TargetCamera(35, window.innerWidth / window.innerHeight, 0.1, 10000)

    this.player = new Player(this)
    this.level = new Level1(this)
  }

  say (text) {
    return new Promise((resolve, reject) => {
      if (!responsiveVoice.voiceSupport()) {
        return reject()
      }
      responsiveVoice.speak(text, voice, {onend: resolve})
    })
  }

  onKeyUp (ev) {
    for (let d in actions) {
      actions[d].forEach(a => {
        if (a.type === 'key' && a.key === ev.keyCode) {
          this.emit('action', {'type': d, value: false})
        }
      })
    }
    if (ev.keyCode === 70) {
      this.emit('fullscreen')
    }
    if (ev.keyCode === 27 && this.fullscreenmode) {
      this.emit('fullscreen')
    }
    // console.log(ev.keyCode)
  }

  onKeyDown (ev) {
    for (let d in actions) {
      actions[d].forEach(a => {
        if (a.type === 'key' && a.key === ev.keyCode) {
          this.emit('action', {'type': d, value: true})
        }
      })
    }
  }

  onTick (dt) {
    const gamepads = navigator.getGamepads()
    if (gamepads && gamepads[0]) {
      for (let d in actions) {
        actions[d].forEach(a => {
          if (a.type === 'axis') {
            if (gamepads[0].axes[a.axis] < 0.5 && gamepads[0].axes[a.axis] > -0.5) {
              this.emit('action', {'type': d, value: false})
            } else if (gamepads[0].axes[a.axis] > 0.5 && a.direction === 1) {
              this.emit('action', {'type': d, value: true})
            } else if (gamepads[0].axes[a.axis] < -0.5 && a.direction === -1) {
              this.emit('action', {'type': d, value: true})
            }
          }
        })
      }
    }
    this.camera.update()
    this.renderer.render(this.scene, this.camera)
  }

  onResize (size) {
    this.camera.aspect = size.width / size.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(size.width, size.height)
  }

  onFullscreen () {
    this.fullscreenmode = !this.fullscreenmode
    if (this.fullscreenmode) {
      if ('webkitCancelFullScreen' in document) {
        this.renderer.domElement.webkitRequestFullScreen()
        this.say('full screen mode activated.')
      } else if ('mozCancelFullScreen' in document) {
        this.renderer.domElement.mozRequestFullScreen()
        this.say('full screen mode activated.')
      } else {
        this.say('Your device is incapable of full screen mode')
      }
    } else {
      if ('webkitCancelFullScreen' in document) {
        document.webkitCancelFullScreen()
        this.say('full screen mode disabled.')
      } else if ('mozCancelFullScreen' in document) {
        document.mozCancelFullScreen()
        this.say('full screen mode disabled.')
      } else {
        this.say('Your device is incapable of full screen mode')
      }
    }
  }
}
