/**
 * @description: First tree.js component
 * @todo:
 *   [ ] show cube defined in 3d-inventory db
 *   [ ] add cube from Angular
 */

import { Observable } from 'rxjs'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { HttpClient } from '@angular/common/http'
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'

import { Connection } from 'src/app/shared/connection'
import { environment } from '../../../environments/environment'
import { DeviceService } from '../../services/device.service'
import { ModelsService } from '../../services/models.service'
import { Device } from '../../shared/device'
import { Model } from '../../shared/model'
import { ConnectionService } from '../../services/connection.service'

@Component({
  selector: 'app-cube',
  templateUrl: './3d.component.html',
  styleUrls: ['./3d.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CubeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef!: ElementRef

  @Input() public rotationSpeedX = 0.1
  @Input() public rotationSpeedY = 0.1
  @Input() public size = 30
  @Input() public texture = '/assets/r710-2.5-nobezel__29341.png'
  @Input() public cameraZ = 500
  @Input() public fieldOfView = 4
  @Input() public nearClippingPlane = 0.1
  @Input() public farClippingPlane = 2000

  private camera!: THREE.PerspectiveCamera

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }

  private loader = new THREE.TextureLoader()
  private geometry = new THREE.BoxGeometry(4, 2, 1)

  private material = new THREE.MeshBasicMaterial({ map: this.loader.load(this.texture) })

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material)

  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene

  deviceList: Device[] = []
  modelList: Model[] = []
  connectionList: Connection[] = []

  component = 'Cube'

  devices$: Observable<Device[]>
  resolveDeviceList: Device[] = []

    ngOnInit() {
    // Component initialization
  }

  constructor(
    private devicesService: DeviceService,
    private modelsService: ModelsService,
    private http: HttpClient,
    private connectionsService: ConnectionService, // <-- Use the correct service here
  ) {
    // console.log('constructor')
    this.material.opacity = 0.8
    this.cube.receiveShadow = true
  }

  public ngAfterViewInit(): void {
    // console.log('ngAfterViewInit')
    // this.loadDevices()
    // this.loadDevices2()
    //  this.loadModels()
    this.createScene()
    this.startRenderingLoop()
  }

  getContrastColor(hexColor: number): number {
    // Convert hex to RGB
    const r = (hexColor >> 16) & 0xff
    const g = (hexColor >> 8) & 0xff
    const b = hexColor & 0xff
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? 0x000000 : 0xffffff
  }

  /**
   * Generates a random pastel color as a THREE.Color instance.
   * @returns {THREE.Color} A random pastel color.
   */
  getRandomPastelColor(): THREE.Color {
    // Pastel colors have high lightness and low-medium saturation
    const hue = Math.random()
    const saturation = 0.4 + Math.random() * 0.2 // 0.4 - 0.6
    const lightness = 0.7 + Math.random() * 0.2 // 0.7 - 0.9
    const color = new THREE.Color()
    color.setHSL(hue, saturation, lightness)
    return color
  }

  /**
   * Generates a random natural-looking color as a THREE.Color instance.
   * Natural colors are less saturated and have moderate lightness.
   * @returns {THREE.Color} A random natural color.
   */
  getRandomNaturalColor(): THREE.Color {
    // Use HSL: moderate saturation, moderate lightness
    const hue = Math.random() // 0-1
    const saturation = 0.25 + Math.random() * 0.25 // 0.25-0.5
    const lightness = 0.35 + Math.random() * 0.3 // 0.35-0.65
    const color = new THREE.Color()
    color.setHSL(hue, saturation, lightness)
    return color
  }

  /**
   * Generates a harmonic color palette as an array of THREE.Color.
   * The palette is based on a base hue and evenly spaced around the color wheel.
   * @param count Number of colors in the palette (default: 5)
   */
  generateHarmonicPaletteColors(count: number = 5): THREE.Color[] {
    const colors: THREE.Color[] = []
    const baseHue = Math.random()
    const saturation = 0.5
    const lightness = 0.7
    for (let i = 0; i < count; i++) {
      // Evenly distribute hues around the color wheel
      const hue = (baseHue + i / count) % 1
      const color = new THREE.Color()
      color.setHSL(hue, saturation, lightness)
      colors.push(color)
    }
    return colors
  }

  /**
   * Creates a 3D device object and adds it to the scene.
   *
   * @param box_x - The width of the 3D box geometry.
   * @param box_y - The height of the 3D box geometry.
   * @param box_z - The depth of the 3D box geometry.
   * @param pos_x - The x-coordinate position of the 3D object in the scene.
   * @param pos_y - The y-coordinate position of the 3D object in the scene.
   * @param pos_z - The z-coordinate position of the 3D object in the scene.
   */

  createDevice3d(
    device_name: string,
    box_x: number,
    box_y: number,
    box_z: number,
    pos_x: number,
    pos_y: number,
    pos_z: number,
  ) {
    // console.log(`createDevice3d parameters: box_x = ${box_x}, box_y = ${box_y}, box_z = ${box_z}, pos_x = ${pos_x}, pos_y = ${pos_y}, pos_z = ${pos_z}`)
    const geometry = new THREE.BoxGeometry(box_x, box_y, box_z)
    const color = this.getRandomNaturalColor()
    // Compute a contrasting color (black or white) for the given color

    const colorText = this.getContrastColor(color.getHex())
    this.material.color = new THREE.Color(color)
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: color })
    this.material.depthTest = false
    this.material.depthWrite = false
    this.material.needsUpdate = true
    this.material.opacity = 0.5
    this.material.side = THREE.DoubleSide
    this.material.transparent = true
    this.material.wireframe = true

    const object = new THREE.Mesh(geometry, sphereMaterial)
    object.position.x = pos_x
    object.position.y = pos_z + box_y / 2
    object.position.z = pos_y
    object.receiveShadow = true
    object.castShadow = true // Enable shadow casting
    this.scene.add(object)

    const loader = new FontLoader()
    this.http
      .get('/assets/fonts/FiraCode_Retina_Regular.json', { responseType: 'text' })
      .subscribe((fontData: string) => {
        const font = loader.parse(JSON.parse(fontData))
        const textGeo = new TextGeometry(device_name, {
          font: font,
          size: 1,
          depth: 0.1,
          curveSegments: 22,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelEnabled: true,
        })

        const material = new THREE.MeshBasicMaterial({ color: colorText })
        const textMesh = new THREE.Mesh(textGeo, material)
        textMesh.position.x = pos_x - (device_name.length * 0.85) / 2
        textMesh.position.y = pos_z + box_y
        textMesh.position.z = pos_y

        textMesh.rotation.x = 0
        textMesh.rotation.y = 0
        textMesh.rotation.z = Math.PI * 2
        textMesh.castShadow = true // Enable shadow casting for text
        textMesh.receiveShadow = true // Enable shadow receiving for text
        this.scene.add(textMesh)
      })
  }

  loadDevices() {
    // console.log('loadDevices')
    return this.devicesService.GetDevices().subscribe((data: Device[]): void => {
      this.deviceList = data
    })
  }

  loadModels() {
    // console.log('loadModels')
    return this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data
    })
  }

  loadConnections() {
    // console.log('loadConnections')
    return this.connectionsService.GetConnections().subscribe((data: Connection[]): void => {
      this.connectionList = data
    })
  }

  FindModelName(id: string): string {
    // console.info('[FindModelName] try find model name by id: ' + id)
    let model = this.modelList.find((e: Model) => e._id === id)?.name ?? 'Unknown'
    if (model === undefined) {
      model = 'Unknown'
    }
    return model
  }

  generate3DDeviceList(): void {
    // console.log('Create device list 3d')
    // console.log('Device list: ' + this.deviceList.length)
    // console.log('Model list: ' + this.modelList.length)
    const createdDevices: string[] = []
    this.deviceList.forEach((device: Device) => {
      const model: Model | undefined = this.modelList.find((e: Model) => e._id === device.modelId)
      if (!model) {
        console.warn(`Model with id ${device.modelId} not found. Skipping device ${device.name}.`)
        return
      }
      this.createDevice3d(
        device.name,
        model.dimension.width,
        model.dimension.height,
        model.dimension.depth,
        device.position.x,
        device.position.y,
        device.position.h,
      )

      createdDevices.push(`Device: ${device.name}, Position: (${device.position.x}, ${device.position.y})`)
    })
    // console.log('Created devices:', createdDevices.join('; '))
  }

  addWalls() {
    const geometry = new THREE.BoxGeometry(51, 10, 1)
    const geometry2 = new THREE.BoxGeometry(1, 10, 51)
    const color = this.getRandomNaturalColor()
    const object1 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: color }))
    const object2 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: color }))
    const object3 = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({ color: color }))
    const object4 = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({ color: color }))

    object1.receiveShadow = true
    object1.castShadow = true
    object2.receiveShadow = true
    object2.castShadow = true
    object3.receiveShadow = true
    object3.castShadow = true
    object4.receiveShadow = true
    object4.castShadow = true

    object1.position.set(0, 5, 25)
    this.scene.add(object1)
    object2.position.set(0, 5, -25)
    this.scene.add(object2)
    object3.position.set(25, 5, 0)
    this.scene.add(object3)
    object4.position.set(-25, 5, 0)
    this.scene.add(object4)
  }

  addLight() {
    // Create a directional light with white color and intensity 2
    const light = new THREE.DirectionalLight(0xffffff, 2)
    light.position.set(30, 50, 50)
    light.castShadow = true // Enable shadow casting

    // Configure shadow properties for better shadow quality and coverage
    light.shadow.mapSize.width = 2048
    light.shadow.mapSize.height = 2048
    light.shadow.camera.near = 0.5
    light.shadow.camera.far = 2000
    light.shadow.camera.left = -50
    light.shadow.camera.right = 50
    light.shadow.camera.top = 50
    light.shadow.camera.bottom = -50
    light.shadow.bias = -0.0001 // Reduce shadow artifacts

    this.scene.add(light)

    // Add a helper to visualize the light and its shadow camera
    const lightHelper = new THREE.DirectionalLightHelper(light, 8)
    this.scene.add(lightHelper)
    const shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera)
    this.scene.add(shadowCameraHelper)
  }

  addDirectionalLight1() {
    let fogNear = 1
    if (this.scene.fog instanceof THREE.Fog) {
      fogNear = this.scene.fog.near
    }
    const lightIntensity = Math.min(2, Math.max(0.5, 1 / fogNear)) // Adjust intensity dynamically
    const light2 = new THREE.DirectionalLight(0xffffff, lightIntensity)
    light2.position.set(30, 30, 50)

    // Enable shadows for this light
    light2.castShadow = true

    // Configure shadow camera for better shadow quality and coverage
    light2.shadow.camera.near = 0.5
    light2.shadow.camera.far = 2000
    light2.shadow.camera.left = -50
    light2.shadow.camera.right = 50
    light2.shadow.camera.top = 50
    light2.shadow.camera.bottom = -50

    // Set shadow map size for higher resolution shadows
    light2.shadow.mapSize.width = 2048
    light2.shadow.mapSize.height = 2048

    // Optional: tweak shadow bias to reduce artifacts
    light2.shadow.bias = -0.0001

    this.scene.add(light2)

    if (!environment.production) {
      const lightHelper2 = new THREE.DirectionalLightHelper(light2, 8, 0xff0000)
      this.scene.add(lightHelper2)
      // Optionally, add a CameraHelper to visualize the shadow camera frustum
      const shadowCameraHelper = new THREE.CameraHelper(light2.shadow.camera)
      this.scene.add(shadowCameraHelper)
    }
  }

  addDirectionalLight2() {
    const light3 = new THREE.DirectionalLight(0xffffff, 1.5)
    const LIGHT3_HUE = 0.1
    const LIGHT3_SATURATION = 1
    const LIGHT3_LIGHTNESS = 0.95
    light3.color.setHSL(LIGHT3_HUE, LIGHT3_SATURATION, LIGHT3_LIGHTNESS)
    light3.position.set(-20, 40, 25)
    light3.castShadow = true

    // Configure shadow properties for better shadow quality
    light3.shadow.mapSize.width = 2048
    light3.shadow.mapSize.height = 2048
    light3.shadow.camera.near = 0.5
    light3.shadow.camera.far = 2000
    light3.shadow.camera.left = -50
    light3.shadow.camera.right = 50
    light3.shadow.camera.top = 50
    light3.shadow.camera.bottom = -50
    light3.shadow.bias = -0.0001

    this.scene.add(light3)

    // Add a helper to visualize the light and its shadow camera
    const lightHelper3 = new THREE.DirectionalLightHelper(light3, 20, 0xdcffee)
    this.scene.add(lightHelper3)

    // Optionally, add a CameraHelper to visualize the shadow camera frustum
    if (light3.castShadow && light3.shadow && light3.shadow.camera) {
      const shadowCameraHelper = new THREE.CameraHelper(light3.shadow.camera)
      this.scene.add(shadowCameraHelper)
    }
  }

  addAmbientLight() {
    const color = 0xafffff
    const intensity = 0.5 // Lower intensity for ambient light to avoid washing out shadows
    const lightAmbient = new THREE.AmbientLight(color, intensity)
    // AmbientLight does not cast shadows in three.js
    this.scene.add(lightAmbient)
  }

  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX
    this.cube.rotation.y += this.rotationSpeedY
  }

  private shadowCube() {
    this.cube.castShadow = true
    this.cube.receiveShadow = true
  }

  addPlane(planeSize: number) {
    const loader = new THREE.TextureLoader()
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xffffff })

    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.receiveShadow = true
    mesh.castShadow = true
    mesh.rotation.x = Math.PI * -0.5
    this.scene.add(mesh)
  }

  materials = [
    new THREE.MeshStandardMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshStandardMaterial({ color: 0xffffff }), // side
  ]

  textMesh1: THREE.Mesh
  group = new THREE.Group()

  addText() {
    // Removed unused variable
    const loader = new FontLoader()
    this.http
      .get('/assets/fonts/FiraCode_Retina_Regular.json', { responseType: 'text' })
      .subscribe((fontData: string) => {
        const font = loader.parse(JSON.parse(fontData))
        const textGeo = new TextGeometry('3d inventory', {
          font: font,
          size: 4,
          depth: 1,
          curveSegments: 20,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelEnabled: true,
        })

        const material = new THREE.MeshBasicMaterial({ color: this.getRandomPastelColor() })
        const textMesh = new THREE.Mesh(textGeo, material)
        textMesh.position.x = -21
        textMesh.position.y = 3
        textMesh.position.z = 25

        textMesh.castShadow = true
        textMesh.receiveShadow = true
        textMesh.material.depthTest = false
        textMesh.material.depthWrite = false
        textMesh.material.needsUpdate = true
        textMesh.material.opacity = 0.8
        textMesh.material.side = THREE.DoubleSide
        textMesh.material.transparent = true

        textMesh.rotation.x = 0
        textMesh.rotation.y = Math.PI * 2
        this.scene.add(textMesh)
      })
  }

  /**
   * Adds an axis helper to the scene for debugging or visualization purposes.
   */
  addAxis() {
    const axesHelper = new THREE.AxesHelper(35)
    this.scene.add(axesHelper)

    // Add arrows for each axis
    const arrowLength = 40
    const arrowHeadLength = 5
    const arrowHeadWidth = 3

    // X axis arrow (red)
    const xDir = new THREE.Vector3(1, 0, 0)
    const xOrigin = new THREE.Vector3(0, 0, 0)
    const xColor = 0xff0000
    const xArrow = new THREE.ArrowHelper(xDir, xOrigin, arrowLength, xColor, arrowHeadLength, arrowHeadWidth)
    this.scene.add(xArrow)

    // Y axis arrow (green)
    const yDir = new THREE.Vector3(0, 1, 0)
    const yColor = 0x00ff00
    const yArrow = new THREE.ArrowHelper(yDir, xOrigin, arrowLength, yColor, arrowHeadLength, arrowHeadWidth)
    this.scene.add(yArrow)

    // Z axis arrow (blue)
    const zDir = new THREE.Vector3(0, 0, 1)
    const zColor = 0x0000ff
    const zArrow = new THREE.ArrowHelper(zDir, xOrigin, arrowLength, zColor, arrowHeadLength, arrowHeadWidth)
    this.scene.add(zArrow)

    // Add labels for each axis
    const loader = new FontLoader()
    this.http
      .get('/assets/fonts/FiraCode_Retina_Regular.json', { responseType: 'text' })
      .subscribe((fontData: string) => {
        const font = loader.parse(JSON.parse(fontData))

        // X axis label
        const xGeo = new TextGeometry('X', {
          font: font,
          size: 2,
          depth: 0.2,
        })
        const xMat = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const xMesh = new THREE.Mesh(xGeo, xMat)
        xMesh.position.set(arrowLength + 1, 0, 0)
        this.scene.add(xMesh)

        // Y axis label
        const yGeo = new TextGeometry('Y', {
          font: font,
          size: 2,
          depth: 0.2,
        })
        const yMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
        const yMesh = new THREE.Mesh(yGeo, yMat)
        yMesh.position.set(0, arrowLength + 1, 0)
        this.scene.add(yMesh)

        // Z axis label
        const zGeo = new TextGeometry('Z', {
          font: font,
          size: 2,
          depth: 0.2,
        })
        const zMat = new THREE.MeshBasicMaterial({ color: 0x0000ff })
        const zMesh = new THREE.Mesh(zGeo, zMat)
        zMesh.position.set(0, 0, arrowLength + 1)
        this.scene.add(zMesh)
      })
  }

  private createScene() {
    // console.log('Create scene')
    this.scene = new THREE.Scene()

    const planeSize = 80
    this.addPlane(planeSize)

    this.scene.background = new THREE.Color(0x555555)
    // Removed invalid properties castShadow and receiveShadow from THREE.Scene

    this.scene.fog = new THREE.Fog(0x333333, 200, 1500)

    //this.addWalls()

    this.addDirectionalLight1()
    this.addDirectionalLight2()

    this.addText()
    this.addAxis()

    // this.loadDevices()
    // this.loadModels()

    this.generate3DDeviceList()
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      this.getAspectRatio(),
      this.nearClippingPlane,
      this.farClippingPlane,
    )
    this.camera.position.z = 500
    this.camera.position.x = 500
    this.camera.position.y = 500
    const controls = new OrbitControls(this.camera, this.canvas)
    this.camera.zoom = 0.8
    controls.target.set(0, 0, 0)
    controls.enablePan = true
    controls.enableZoom = true
    controls.autoRotate = true

    controls.update()
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
    this.renderer.shadowMap.enabled = true
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

    const fov = 75
    const near = 0.01
    const far = 3000
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)
    camera.position.set(10, 20, 20)

    const controls = new OrbitControls(camera, this.canvas)
    controls.target.set(10, 40, 30)
    controls.update()

    this.render = this.render.bind(this)
    requestAnimationFrame(this.render)
  }

  private render() {
    requestAnimationFrame(this.render)
    this.animateCube()
    this.shadowCube()
    this.renderer.render(this.scene, this.camera)
  }
}
