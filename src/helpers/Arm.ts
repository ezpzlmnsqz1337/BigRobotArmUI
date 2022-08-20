import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import { Joint, RobotArmData } from '@/store'
import { Camera, Mesh, PerspectiveCamera, Renderer, Scene } from 'three'

type InPosition = Record<string, boolean>
type RotationAxis = 'x' | 'y' | 'z'

export class Arm {
  protected el: HTMLElement
  protected scene: Scene | null = null
  protected camera: PerspectiveCamera | null = null
  protected renderer: Renderer | null = null
  protected stats: Stats | null = null
  protected controls: OrbitControls | null = null

  protected inPosition: InPosition
  protected firedInPosition = false
  protected previewSpeed = 0.005
  protected arm: RobotArmData

  constructor(el: HTMLElement, arm: RobotArmData) {
    this.el = el
    this.scene = null
    this.camera = null
    this.renderer = null
    this.stats = null
    this.controls = null

    this.inPosition = arm.joints.reduce((prev: InPosition, next) => {
      prev[next.name] = true
      return prev
    }, {})

    this.arm = arm
  }

  init() {
    this.setupScene()
    this.setupControls()
    this.setupStats()
    this.loadModel()

    this.animate()

    eb.on(EventType.SET_PREVIEW_SPEED, e => (this.previewSpeed = e))
  }

  animate() {
    if (!this.renderer || !this.scene || !this.camera) return

    requestAnimationFrame(this.animate.bind(this))

    this.arm.joints.forEach(x => this.handleJoint(x))

    this.renderer.render(this.scene, this.camera)
  }

  handleResize() {
    if (!this.renderer || !this.camera) return

    this.camera.aspect = this.el.offsetWidth / this.el.offsetHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight)
  }

  handleJoint(joint: Joint) {
    if (joint.mesh) {
      const rAxis = joint.rotationAxis as RotationAxis
      const position = parseFloat(joint.mesh.rotation[rAxis].toFixed(2))

      let target = (joint.target / joint.stepsPerDegree) * (Math.PI / 180)
      target = parseFloat(target.toFixed(2))

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

    this.handlePreview()
  }

  handlePreview() {
    if (this.arm.preview && this.isInPosition()) {
      eb.emit(EventType.ARM_IN_POSITION)
      Object.keys(this.inPosition).forEach(x => (this.inPosition[x] = false))
    }
  }

  isInPosition() {
    return !Object.values(this.inPosition).includes(false)
  }

  mapAngle(value: number, x1: number, y1: number, x2: number, y2: number) {
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
    this.stats = Stats()
    this.stats.dom.style.height = '48px'
    // [].forEach.call(
    //   this.stats.dom.children,
    //   child => (child.style.display = '')
    // )
  }
  setupControls() {
    if (!this.renderer || !this.camera) return

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.autoRotate = false
    this.controls.autoRotateSpeed = -10
    this.controls.screenSpacePanning = true
  }

  loadModel() {
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderConfig({ type: 'js' })
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')

    gltfLoader.setDRACOLoader(dracoLoader)

    gltfLoader.load(
      require('@/assets/models/BigRobotArmWebCompressed.glb'),
      gltf => {
        if (!this.scene) return
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
    if (!this.scene || !this.camera) return

    const arm = this.scene.getObjectByName('BigRobotArm')
    if (!arm) return
    const center = new THREE.Vector3()
    new THREE.Box3().setFromObject(arm).getCenter(center)
    this.camera.lookAt(center)
    // console.log(arm)
  }

  setupShafts() {
    if (!this.scene || !this.camera) return

    this.arm.joints.find(
      x => x.name === 'base'
    )!.mesh = this.scene.getObjectByName('ShaftBase')
    this.arm.joints.find(
      x => x.name === 'shoulder'
    )!.mesh = this.scene.getObjectByName('ShaftShoulder')
    this.arm.joints.find(
      x => x.name === 'elbow'
    )!.mesh = this.scene.getObjectByName('ShaftElbow')
    this.arm.joints.find(
      x => x.name === 'wristRotate'
    )!.mesh = this.scene.getObjectByName('ShaftWristRotate')
    this.arm.joints.find(
      x => x.name === 'wrist'
    )!.mesh = this.scene.getObjectByName('ShaftWrist')
  }

  setPosition() {}
}
