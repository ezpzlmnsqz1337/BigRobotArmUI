import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const RIGHT_ANGLE_EULER = 1.5

export class Arm {
  constructor(el, arm) {
    this.el = el
    this.scene = null
    this.camera = null
    this.renderer = null
    this.stats = null
    this.controls = null

    this.arm = arm
  }

  init() {
    this.setupScene()
    this.setupControls()
    this.setupStats()
    this.loadModel()

    this.animate()
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this))

    this.arm.joints.forEach(x => this.handleJoint(x))

    this.renderer.render(this.scene, this.camera)
  }

  handleJoint(joint) {
    if (joint.mesh) {
      const rAxis = joint.rotationAxis
      const position = parseFloat(joint.mesh.rotation[rAxis].toFixed(2))
      const target = this.mapAngle(
        joint.target,
        joint.min,
        joint.max,
        -RIGHT_ANGLE_EULER,
        RIGHT_ANGLE_EULER
      )
      if (position < target) {
        joint.mesh.rotation[rAxis] += 0.01
      } else if (position > target) {
        joint.mesh.rotation[rAxis] -= 0.01
      }
    }
  }

  mapAngle(value, x1, y1, x2, y2) {
    return ((value - x1) * (y2 - x2)) / (y1 - x1) + x2
  }

  setupScene() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.el.offsetWidth / this.el.offsetHeight,
      0.1,
      1000
    )

    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight)
    this.el.appendChild(this.renderer.domElement)

    this.camera.position.z = 5
    const light = new THREE.AmbientLight(0x404040) // soft white light
    light.intensity = 2
    this.scene.add(light)
  }

  setupStats() {
    this.stats = new Stats()
    this.stats.dom.height = '48px'
    // [].forEach.call(
    //   this.stats.dom.children,
    //   child => (child.style.display = '')
    // )
  }
  setupControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.autoRotate = false
    this.controls.autoRotateSpeed = -10
    this.controls.screenSpacePanning = true
  }

  loadModel() {
    const loader = new GLTFLoader()

    loader.load(
      require('@/assets/models/BigRobotArmWeb.glb'),
      gltf => {
        this.scene.add(gltf.scene)
        // console.log(this.scene, gltf)
        this.setupShafts()
      },
      undefined,
      error => {
        console.error(error)
      }
    )
  }

  setupShafts() {
    this.arm.joints.find(
      x => x.name === 'base'
    ).mesh = this.scene.getObjectByName('ShaftBase')
    this.arm.joints.find(
      x => x.name === 'shoulder'
    ).mesh = this.scene.getObjectByName('ShaftShoulder')
    this.arm.joints.find(
      x => x.name === 'elbow'
    ).mesh = this.scene.getObjectByName('ShaftElbow')
    this.arm.joints.find(
      x => x.name === 'wristRotate'
    ).mesh = this.scene.getObjectByName('ShaftWristRotate')
    this.arm.joints.find(
      x => x.name === 'wrist'
    ).mesh = this.scene.getObjectByName('ShaftWrist')
  }

  setPosition() {}
}
