import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { Joint } from '@/assets/joints'
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import { RobotArmData } from '@/store/armControlStore'
import {
  ColorRepresentation,
  MeshStandardMaterial,
  PerspectiveCamera,
  Renderer,
  Scene
} from 'three'

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

  static readonly SCENE_NAME = 'BigRobotArm'
  static readonly BACKGROUND_COLOR: ColorRepresentation = 0xe9e9e9
  static readonly LIGHT_COLOR: ColorRepresentation = 0xffffff
  static readonly DEFAULT_CAMERA_POSITION: THREE.Vector3Tuple = [0.7, 1, 0.7]
  static readonly DEFAULT_CAMERA_ROTATION: THREE.Vector3Tuple = [
    -0.49,
    0.72,
    0.34
  ]

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
    eb.on(EventType.CENTER_CAMERA, () => this.centerCamera())
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

      let target =
        (joint.position.target / joint.stepsPerDegree) * (Math.PI / 180)
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

    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight)
    ;(this.renderer as THREE.WebGLRenderer).shadowMap.enabled = true
    ;(this.renderer as THREE.WebGLRenderer).shadowMap.type =
      THREE.PCFSoftShadowMap
    this.el.appendChild(this.renderer.domElement)

    const texture = new THREE.TextureLoader().load(
      require('@/assets/textures/wood-floor.jpg')
    )
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10, 10)

    // immediately use the texture for material creation
    const woodFloorMaterial = new THREE.MeshStandardMaterial({ map: texture })

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 10, 10),
      woodFloorMaterial
    )
    ground.receiveShadow = true
    ground.rotation.x = Math.PI / 2
    ground.rotation.y = Math.PI

    const aLight = new THREE.AmbientLight(Arm.LIGHT_COLOR, 0.3)

    const pLight = this._createPointLight(
      Arm.LIGHT_COLOR,
      0.8,
      new THREE.Vector3(1.1, 2.5, 1.1),
      true
    )
    const helper = new THREE.PointLightHelper(pLight, 1)

    this.scene.background = new THREE.Color(Arm.BACKGROUND_COLOR)

    this.scene.add(ground)
    this.scene.add(aLight)
    this.scene.add(pLight)
    this.scene.add(helper)

    this.camera.position.set(...Arm.DEFAULT_CAMERA_POSITION)
  }

  private _createPointLight(
    color: ColorRepresentation,
    intensity: number,
    position?: THREE.Vector3,
    shadow?: boolean
  ) {
    const pLight = new THREE.PointLight(color, intensity)
    pLight.castShadow = !!shadow
    pLight.shadow.mapSize = new THREE.Vector2(2048, 2048)
    pLight.shadow.bias = -0.00001
    if (position) {
      pLight.position.set(position.x, position.y, position.z)
    }
    return pLight
  }

  setupStats() {
    this.stats = Stats()
    this.stats.dom.style.height = '48px'
  }
  setupControls() {
    if (!this.renderer || !this.camera) return

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.autoRotate = false
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
        gltf.scene.name = Arm.SCENE_NAME
        gltf.scene.position.y = 0.4
        gltf.scene.traverse(x => {
          x.castShadow = true
          x.receiveShadow = true
        })
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

    const arm = this.scene.getObjectByName(Arm.SCENE_NAME)
    if (!arm) return
    const center = new THREE.Vector3()
    new THREE.Box3().setFromObject(arm).getCenter(center)
    this.controls?.target.set(center.x, center.y, center.z)
    this.camera.position.set(...Arm.DEFAULT_CAMERA_POSITION)
    this.camera.rotation.set(...Arm.DEFAULT_CAMERA_ROTATION)
  }

  setupShafts() {
    if (!this.scene || !this.camera) return

    this.arm.joints.forEach(x => {
      x.mesh = this.scene?.getObjectByName(x.meshId)
    })
  }

  setPosition() {}
}
