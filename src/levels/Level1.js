import THREE from 'three'
import Level from '../Level'
import actions from '../actions'
import Music from '../Music'

export default class Level1 extends Level {
  constructor (game) {
    super(game)

    this.lesson1 = this.lesson1.bind(this)
    this.lesson2 = this.lesson2.bind(this)
    this.lesson3 = this.lesson3.bind(this)
    this.onInstruct = this.onInstruct.bind(this)

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

    this.music = new Music('(t<<3)*[8/9,1,9/8,6/5,4/3,3/2,0][[0xd2d2c8,0xce4088,0xca32c8,0x8e4009][t>>14&3]>>(0x3dbe4688>>((t>>10&15)>9?18:t>>10&15)*3&7)*3&7]', false, false, 20)
    this.music.volume = 0.05
    this.music.play()

    const sayHello = () => {
      this.game.say(`I am your instructor. Today, we will learn how to engage with the ghost net. At any time, you may press "${actions.instruct[0].name}" to repeat the last instruction.`)
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
      if (lesson === 1) {
        this.lessonActions = []
        this.game.on('action', this.lesson1)
        this.game.say('Please familiarize yourself with the directional controls.')
      } else if (lesson === 2) {
        this.lastLesson = 2
        this.game.off('action', this.lesson1)
        this.game.on('action', this.lesson2)
        this.game.say('Head towards the west edge of the data-grid.')
      } else if (lesson === 3) {
        this.lastLesson = 3
        this.game.off('action', this.lesson2)
        this.game.on('fullscreen', this.lesson3)
        this.game.say(`Press "${actions.fullscreen[0].name}" for fullscreen`)
      } else if (lesson === 4) {
        this.lastLesson = 4
        this.game.off('fullscreen', this.lesson3)
        this.game.say('That concludes our lessons. Eventually, I will have more in here.')
          .then(() => {
            console.log('stop')
            this.music.pause()
          })
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
    this.game.say('Good.').then(() => {
      this.emit('lesson', 4)
    })
  }

  onTick (dt) {
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
