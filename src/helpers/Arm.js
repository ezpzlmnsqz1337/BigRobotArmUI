import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import eb from '../EventBus'

const RIGHT_ANGLE_EULER = 1.5

export class Arm {
  constructor(el, arm) {
    this.el = el
    this.scene = null
    this.camera = null
    this.renderer = null
    this.stats = null
    this.controls = null

    this.inPosition = arm.joints.reduce((prev, next) => {
      prev[next.name] = true
      return prev
    }, {})

    this.firedInPosition = false
    this.previewSpeed = 0.005

    this.arm = arm
  }

  init() {
    this.setupScene()
    this.setupControls()
    this.setupStats()
    this.loadModel()

    this.animate()

    eb.on('setPreviewSpeed', e => (this.previewSpeed = e))
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
      let target = this.mapAngle(
        joint.target,
        joint.min,
        joint.max,
        -RIGHT_ANGLE_EULER,
        RIGHT_ANGLE_EULER
      )
      if (joint.inverted) target *= -1
      if (position === target) {
        this.inPosition[joint.name] = true
      } else if (position < target) {
        this.inPosition[joint.name] = false
        joint.mesh.rotation[rAxis] += this.previewSpeed
      } else if (position > target) {
        this.inPosition[joint.name] = false
        joint.mesh.rotation[rAxis] -= this.previewSpeed
      }
    }

    if (this.isInPosition()) {
      if (!this.firedInPosition) {
        eb.emit('inPosition')
        this.firedInPosition = true
      }
    } else {
      this.firedInPosition = false
    }
  }

  isInPosition() {
    return !Object.values(this.inPosition).includes(false)
  }

  mapAngle(value, x1, y1, x2, y2) {
    return parseFloat((((value - x1) * (y2 - x2)) / (y1 - x1) + x2).toFixed(2))
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

    const light = new THREE.AmbientLight(0x404040) // soft white light
    light.intensity = 3
    this.scene.background = new THREE.Color(0xdddddd)
    this.scene.add(light)

    this.camera.position.x = 1
    this.camera.position.y = 1
    this.camera.position.z = 0.5
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
        gltf.scene.name = 'BigRobotArm'
        this.setupShafts()
        this.centerCamera()
      },
      undefined,
      error => {
        console.error(error)
      }
    )
  }

  centerCamera() {
    const arm = this.scene.getObjectByName('BigRobotArm')
    const center = new THREE.Vector3()
    new THREE.Box3().setFromObject(arm).getCenter(center)
    this.camera.lookAt(center)
    console.log(arm)
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