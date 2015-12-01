import THREE from 'three'
import Level from '../Level'

export default class Level1 extends Level {
  constructor (game) {
    super(game)

    this.lesson1Action = this.lesson1Action.bind(this)
    this.lesson2Action = this.lesson2Action.bind(this)

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

    this.on('lesson', (lesson) => {
      if (lesson === 1) {
        this.game.say('Please familiarize yourself with the directional controls.')
          .then(() => {
            this.lessonActions = []
            this.game.on('action', this.lesson1Action)
          })
      } else if (lesson === 2) {
        this.game.off('action', this.lesson1Action)
        this.game.say('Good. Now, head towards the west edge of the data-grid.')
          .then(() => {
            this.game.on('action', this.lesson2Action)
          })
      } else if (lesson === 3) {
        this.game.off('action', this.lesson2Action)
        this.game.say('Good. Now, press "F" for fullscreen.')
          .then(() => {
            this.game.on('fullscreen', () => {
              this.emit('lesson', 4)
            })
          })
      }
    })
  }

  lesson1Action (action) {
    if (action.value === true && this.lessonActions.indexOf(action.type) === -1) {
      this.game.say(action.type).then(() => {
        this.lessonActions.push(action.type)
        if (this.lessonActions.length === 4) {
          this.emit('lesson', 2)
        }
      })
    }
  }

  lesson2Action (action) {
    if (this.game.player.position.x < -395) {
      this.emit('lesson', 3)
    }
  }

  onTick (dt) {}

  destructor () {}
}
