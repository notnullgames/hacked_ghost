import THREE from 'three'

import effectcomposer from 'three-effectcomposer'
export const EffectComposer = effectcomposer(THREE)
import RGBShiftShader from './RGBShiftShader'

export default class ScreenShader {
  constructor (effects, renderer, scene, camera) {
    this.composer = new EffectComposer(renderer)
    this.composer.addPass(new EffectComposer.RenderPass(scene, camera))
    effects = effects || []
    effects.forEach((effect) => {
      this.composer.addPass(effect)
    })
    var effect = new EffectComposer.ShaderPass(RGBShiftShader)
    effect.renderToScreen = true
    this.composer.addPass(effect)
  }

  render () {
    this.composer.render()
  }
}
