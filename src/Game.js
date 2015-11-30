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

export default class Game {
  constructor () {
    emitonoff(this)

    this.engine = loop(dt => { this.emit('tick', dt) }).start()

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0x000000, 1)
    document.body.appendChild(this.renderer.domElement)

    // map inputs to emitters & handle tick
    window.addEventListener('keydown', this.onKeyDown.bind(this))
    window.addEventListener('keyup', this.onKeyUp.bind(this))
    this.on('tick', this.onTick.bind(this))

    this.scene = new THREE.Scene()
    this.camera = new TargetCamera(35, window.innerWidth / window.innerHeight, 0.1, 10000)

    this.player = new Player(this)
    this.level = new Level1(this)

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }, false)
  }

  onKeyUp (ev) {
    for (let d in actions) {
      actions[d].forEach(a => {
        if (a.type === 'key' && a.key === ev.keyCode) {
          this.emit('action', {'type': d, value: false})
        }
      })
    }
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
            if (gamepads[0][a.axis] > 0.5 && a.direction === 1) {
              this.emit('action', {'type': d, value: true})
            } else if (gamepads[0][a.axis] < -0.5 && a.direction === -1) {
              this.emit('action', {'type': d, value: true})
            } else {
              this.emit('action', {'type': d, value: false})
            }
          }
        })
      }
    }
    this.camera.update()
    this.renderer.render(this.scene, this.camera)
  }
}
