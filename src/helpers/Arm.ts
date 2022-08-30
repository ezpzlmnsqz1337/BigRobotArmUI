import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { Joint } from '@/assets/joints'
import { EventType } from '@/constants/types/EventType'
import eb from '@/EventBus'
import { RobotArmData } from '@/store/armControlStore'
import { ColorRepresentation, PerspectiveCamera, Renderer, Scene } from 'three'

type InPosition = Record<string, boolean>
type RotationAxis = 'x' | 'y' | 'z'

export class Arm {
  protected el: HTMLElement
  protected scene: Scene | null = null
  protected camera: PerspectiveCamera | null = null
  protected renderer: Renderer | null = null
  protected stats: Stats | null = null
  protected controls: OrbitControls | null = null
  protected _antialias = true

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

    this.inPosition = arm.joints.reduce((prev: InPosition, next) => {
      prev[next.name] = true
      return prev
    }, {})

    this.arm = arm
  }

  init() {
    this._setup()

    eb.on(EventType.SET_PREVIEW_SPEED, e => (this.previewSpeed = e))
    eb.on(EventType.CENTER_CAMERA, () => this.centerCamera())
    eb.on(EventType.TOGGLE_ANTIALIASING, () => this.toggleAntialias())
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

  handleResize() {
    if (!this.renderer || !this.camera) return

    this.camera.aspect = this.el.offsetWidth / this.el.offsetHeight
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight)
  }

  isInPosition() {
    return !Object.values(this.inPosition).includes(false)
  }

  get antialias() {
    return this._antialias
  }

  toggleAntialias() {
    this._antialias = !this._antialias
    this._setup()
  }

  protected _animate() {
    if (!this.renderer || !this.scene || !this.camera) return

    requestAnimationFrame(this._animate.bind(this))

    this.arm.joints.forEach(x => this._handleJoint(x))

    this.renderer.render(this.scene, this.camera)

    this.stats?.update()
  }

  protected _deinit() {
    this.scene?.clear()
    this.stats?.end()
    this.controls?.dispose()
    this.camera?.clear()
    ;(this.renderer as THREE.WebGLRenderer)?.dispose()
  }

  protected _setup() {
    this._deinit()
    this._setupScene()
    this._setupControls()
    // this._setupStats()
    this._loadModel()

    this._animate()
  }

  protected _handleJoint(joint: Joint) {
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

    this._handlePreview()
  }

  protected _handlePreview() {
    if (this.arm.preview && this.isInPosition()) {
      eb.emit(EventType.ARM_IN_POSITION)
      Object.keys(this.inPosition).forEach(x => (this.inPosition[x] = false))
    }
  }

  protected _setupScene() {
    eb.emit(EventType.ARM_MODEL_LOADING_MESSAGE, 'Setting up the scene')

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.el.offsetWidth / this.el.offsetHeight,
      0.1,
      1000
    )

    this.renderer = new THREE.WebGLRenderer({ antialias: this._antialias })
    this.renderer.setSize(this.el.offsetWidth, this.el.offsetHeight)
    ;(this.renderer as THREE.WebGLRenderer).shadowMap.enabled = true
    ;(this.renderer as THREE.WebGLRenderer).shadowMap.type = THREE.VSMShadowMap
    this.el.innerHTML = ''
    setTimeout(() => this.el.appendChild(this.renderer!.domElement))

    this._setupGround()
    this._setupLights()

    this.centerCamera()
  }

  protected _setupGround() {
    if (!this.scene) return

    const texture = new THREE.TextureLoader().load(
      require('@/assets/textures/wood-floor.jpg')
    )
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(10, 8)
    // immediately use the texture for material creation
    const woodFloorMaterial = new THREE.MeshStandardMaterial({ map: texture })

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10, 10, 10),
      woodFloorMaterial
    )
    ground.receiveShadow = true
    ground.rotation.x = Math.PI / 2
    ground.rotation.y = Math.PI

    this.scene.add(ground)
    //this.scene.fog = new THREE.Fog(0x1f1f1f, 0.9, 8)
  }

  protected _setupLights() {
    if (!this.scene) return

    const aLight = new THREE.AmbientLight(Arm.LIGHT_COLOR, 0.3)

    const pLight = this._createPointLight(
      Arm.LIGHT_COLOR,
      0.8,
      new THREE.Vector3(1.1, 2.5, 1.1),
      true
    )

    this.scene.background = new THREE.Color(Arm.BACKGROUND_COLOR)

    this.scene.add(aLight, pLight)
  }

  protected _createPointLight(
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

  protected _setupStats() {
    this.stats = Stats()
    document.body.appendChild(this.stats.dom)
  }

  protected _setupControls() {
    if (!this.renderer || !this.camera) return

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.autoRotate = false
    this.controls.screenSpacePanning = true
  }

  protected _setupShafts() {
    if (!this.scene || !this.camera) return

    this.arm.joints.forEach(x => {
      x.mesh = this.scene?.getObjectByName(x.meshId)
    })
  }

  protected _loadModel() {
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderConfig({ type: 'js' })
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')

    gltfLoader.setDRACOLoader(dracoLoader)

    gltfLoader.load(
      require('@/assets/models/BigRobotArmWebCompressed.glb'),
      gltf => this._onGLTFModelLoaded(gltf),
      e => eb.emit(EventType.ARM_MODEL_LOADING_PROGRESS, e),
      err => eb.emit(EventType.ARM_MODEL_LOADED_ERROR, err)
    )
  }

  protected _onGLTFModelLoaded(gltf: GLTF) {
    if (!this.scene) return

    this.scene.add(gltf.scene)

    gltf.scene.name = Arm.SCENE_NAME
    gltf.scene.position.y = 0.4
    gltf.scene.traverse(x => {
      x.castShadow = true
      x.receiveShadow = true
    })
    this._setupShafts()
    this.centerCamera()
    eb.emit(EventType.ARM_MODEL_LOADED)
  }
}
