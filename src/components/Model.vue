<template>
  <b-container fluid>
    <h2>Model</h2>
    <b-row>
      <b-col class="my-auto controls center p-5"
        ><div ref="modelWrapper" class="__modelWrapper"
      /></b-col>
    </b-row>
  </b-container>
</template>

<script>
// import ws from '@/shared'
import * as THREE from 'three'

export default {
  name: 'Model',
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null
    }
  },
  created: function() {
    this.$root.$on('ws-message-received', e => this.handleMessage(e))
  },
  mounted: function() {
    const modelWrapper = this.$refs.modelWrapper
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      modelWrapper.offsetWidth / modelWrapper.offsetHeight,
      0.1,
      1000
    )

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(modelWrapper.offsetWidth, modelWrapper.offsetHeight)
    modelWrapper.appendChild(this.renderer.domElement)

    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    cube.name = 'myCube'
    this.scene.add(cube)

    this.camera.position.z = 5

    this.animate()
  },
  methods: {
    handleMessage(message) {
      if (message.includes('READY')) this.disabled = false
      this.addMessage(message, false)
    },
    animate() {
      requestAnimationFrame(this.animate)

      const cube = this.scene.getObjectByName('myCube')
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      this.renderer.render(this.scene, this.camera)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.__modelWrapper {
  width: 640px;
  height: 480px;
  margin: 0 auto;
}
</style>
