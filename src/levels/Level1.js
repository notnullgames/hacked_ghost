import THREE from 'three'
import Level from '../Level'

export default class Level1 extends Level {
  constructor (game) {
    super(game)

    var light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 100, 0)
    game.scene.add(light)
    var sky = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture('assets/universe.jpg'),
      side: THREE.BackSide
    })
    game.scene.add(new THREE.Mesh(new THREE.SphereGeometry(2000, 32, 32), sky))
    game.scene.add(new THREE.GridHelper(400, 10))

    setTimeout(() => {
      this.game.say('Welcome to level 1. I am your instructor. Today, we will learn how to engage with the ghost net.')
        .then(() => {
          this.emit('lesson', 1)
        })
    }, 500)

    this.lesson1 = this.lesson1.bind(this)
    this.lesson2 = this.lesson2.bind(this)
    this.lesson3 = this.lesson3.bind(this)

    this.on('lesson', (lesson) => {
      console.log('lesson', lesson)
      if (lesson === 1) {
        this.lessonActions = []
        this.game.on('action', this.lesson1)
        this.game.say('Please familiarize yourself with the directional controls.')
      } else if (lesson === 2) {
        this.game.off('action', this.lesson1)
        this.game.say('Good.')
          .then(() => {
            this.game.on('action', this.lesson2)
            this.game.say('Now, head towards the west edge of the data-grid.')
          })
      } else if (lesson === 3) {
        this.game.off('action', this.lesson2)
        this.game.say('Good.')
          .then(() => {
            this.game.on('fullscreen', this.lesson3)
            this.game.say('Now, press "F" for fullscreen')
          })
      } else if (lesson === 4) {
        this.game.off('fullscreen', this.lesson3)
        this.game.say('Good.')
          .then(() => {
            this.game.say('That concludes our lessons. Eventually, I will have more in here.')
          })
      }
    })
  }

  lesson1 (action) {
    if (action.value === true && this.lessonActions.indexOf(action.type) === -1) {
      this.lessonActions.push(action.type)
      this.game.say(action.type).then(() => {
        if (this.lessonActions.length === 4) {
          this.emit('lesson', 2)
        }
      })
    }
  }

  lesson2 (action) {
    if (this.game.player.position.x < -399) {
      this.emit('lesson', 3)
    }
  }

  lesson3 () {
    this.emit('lesson', 4)
  }

  onTick (dt) {
    // define bounds of grid
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
