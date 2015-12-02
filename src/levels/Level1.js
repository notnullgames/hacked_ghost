import THREE from 'three'
import Level from '../Level'
import actions from '../actions'
import Music from '../Music'
import DataTerminal from '../DataTerminal'

import ScreenShader, {EffectComposer} from '../shaders/ScreenShader'
import DigitalGlitch from '../shaders/DigitalGlitch'

export default class Level1 extends Level {
  constructor (game) {
    super(game)

    this.lesson1 = this.lesson1.bind(this)
    this.lesson2 = this.lesson2.bind(this)
    this.lesson3 = this.lesson3.bind(this)
    this.lesson5 = this.lesson5.bind(this)
    this.onInstruct = this.onInstruct.bind(this)

    this.glitch = new EffectComposer.ShaderPass(DigitalGlitch)
    this.glitch.uniforms['amount'].value = 0.001
    this.composer = new ScreenShader([
      this.glitch
    ], this.game.renderer, this.game.scene, this.game.camera)

    var light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 100, 0)
    this.game.scene.add(light)
    var sky = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture('assets/universe.jpg'),
      side: THREE.BackSide
    })
    this.game.scene.add(new THREE.Mesh(new THREE.SphereGeometry(2000, 32, 32), sky))
    this.game.scene.add(new THREE.GridHelper(400, 10))
    this.game.on('instruct', this.onInstruct)
    this.lastLesson = 1

    const checkback = setInterval(() => {
      if (this.lastLesson === 1) {
        this.emit('lesson', 1)
      } else {
        clearInterval(checkback)
      }
    }, 30000)

    this.music = new Music('(t<<3)*[8/9,1,9/8,6/5,4/3,3/2,0][[0xd2d2c8,0xce4088,0xca32c8,0x8e4009][t>>14&3]>>(0x3dbe4688>>((t>>10&15)>9?18:t>>10&15)*3&7)*3&7]', false, 4000, 40)
    this.music.volume = 0.03
    this.music.play()

    const sayHello = () => {
      this.game.say(`I am your instructor. Today, we will learn how to engage with the ghost net. At any time, you may press "${actions.instruct[0].name}" to repeat the last instruction. We are currently experiencing reduced bandwidth.`)
        .then(() => {
          this.emit('lesson', 1)
        })
        .catch((reason) => {
          if (reason === 'not ready') {
            setTimeout(sayHello)
          }
        })
    }
    sayHello()

    this.on('lesson', lesson => {
      this.lastLesson = lesson
      if (lesson === 1) {
        this.lessonActions = []
        this.game.on('action', this.lesson1)
        this.game.say('Please familiarize yourself with the directional controls.')
      } else if (lesson === 2) {
        this.game.off('action', this.lesson1)
        this.game.on('action', this.lesson2)
        this.game.say('Head towards the west edge of the data-grid.')
      } else if (lesson === 3) {
        this.game.off('action', this.lesson2)
        this.game.on('fullscreen', this.lesson3)
        this.game.say(`Press "${actions.fullscreen[0].name}" for fullscreen`)
      } else if (lesson === 4) {
        this.game.off('fullscreen', this.lesson3)
        this.music.pause()
        this.emit('lesson', 5)
      } else if (lesson === 5) {
        if (!this.terminal) {
          this.terminal = new DataTerminal(this.game)
          this.terminal.name = 'dataterm0001'
          this.game.collidables.push(this.terminal)
          this.game.scene.add(this.terminal)
          this.game.on('collide', this.lesson5)
        }
        this.game.say(`Engage the green data terminal to continue.`)
      } else if (lesson === 6) {
        this.game.off('collide', this.lesson6)
        this.game.say('type "login"')
        this.terminal.open()
      } else if (lesson === 10) {
        this.game.say('That concludes our lessons. Bandwidth has increased. Eventually, I will have more in here. ')
      }
    })
  }

  onInstruct () {
    this.emit('lesson', this.lastLesson)
  }

  lesson1 (action) {
    if (action.value && this.lessonActions.indexOf(action.type) === -1) {
      this.lessonActions.push(action.type)
      this.game.say(action.type).then(() => {
        if (this.lessonActions.length === 4) {
          this.game.say('Good.').then(() => {
            this.emit('lesson', 2)
          })
        }
      })
    }
  }

  lesson2 (action) {
    if (this.game.player.position.x < -399) {
      this.game.say('Good job.').then(() => {
        this.emit('lesson', 3)
      })
    }
  }

  lesson3 () {
    this.game.say('Good. Bandwidth has increased.').then(() => {
      this.emit('lesson', 4)
    })
  }

  lesson5 (objects) {
    this.game.say('Good.').then(() => {
      this.emit('lesson', 6)
    })
  }

  onTick (dt) {
    if (this.lastLesson < 5) {
      this.composer.render()
      if (Math.random() > 0.9) {
        this.glitch.uniforms['angle'].value = Math.random() * 360
      }
      this.glitch.uniforms['byp'].value = Math.random() < 0.999
    } else {
      this.glitch.uniforms['byp'].value = false
      this.glitch.uniforms['angle'].value = 0
      this.glitch.uniforms['amount'].value = 0
    }

    // simple define bounds of grid
    if (this.game.player.position.x < -400) {
      this.game.player.position.x = -400
    }else if (this.game.player.position.x > 400) {
      this.game.player.position.x = 400
    }
    if (this.game.player.position.z < -400) {
      this.game.player.position.z = -400
    }else if (this.game.player.position.z > 400) {
      this.game.player.position.z = 400
    }
  }

  destructor () {}
}
