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
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { HttpClient } from '@angular/common/http'
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
// Removed unused import

import { DeviceService } from '../../services/device.service'
import { ModelsService } from '../../services/models.service'
import { Device } from '../../shared/device'
import { Model } from '../../shared/model'

@Component({ selector: 'app-cube', templateUrl: './3d.component.html', styleUrls: ['./3d.component.scss'] })
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

  component = 'Cube'

  devices$: Observable<Device[]>
  resolveDeviceList: Device[] = []

  ngOnInit() {
    console.log('ngOnInit')
    this.deviceList = this.route.snapshot.data.resolveDeviceList || []
    this.modelList = this.route.snapshot.data.resolveModelList
    // this.loadDevices()
    // this.loadModels()
  }

  constructor(
    private devicesService: DeviceService,
    private modelsService: ModelsService,
    // Removed unused property
    private route: ActivatedRoute,
    private http: HttpClient,
  ) {
    console.log('constructor')
    this.material.opacity = 0.8
    this.cube.receiveShadow = true
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit')
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
    const luminance = (0.299 * r + 0.587 * g + 0.124 * b) / 255
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? 0x000000 : 0xffffff
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
    console.log('createDevice3d parameters: ', box_x, box_y, box_z, pos_x, pos_y, pos_z)
    const geometry = new THREE.BoxGeometry(box_x, box_y, box_z)
    let color = Math.random() * 0xffffff
    // Compute a contrasting color (black or white) for the given color

    const colorText = this.getContrastColor(color)
    this.material.color = new THREE.Color(color)
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: color })
    this.material.opacity = 0.3

    const object = new THREE.Mesh(geometry, sphereMaterial)
    object.position.x = pos_x
    object.position.y = Math.round(pos_z + box_z / 2)
    object.position.z = pos_y
    object.castShadow = true
    object.receiveShadow = true
    this.scene.add(object)

    const loader = new FontLoader()
    this.http
      .get('/assets/fonts/FiraCode_Retina_Regular.json', { responseType: 'text' })
      .subscribe((fontData: string) => {
        const font = loader.parse(JSON.parse(fontData))
        const textGeo = new TextGeometry(device_name, {
          font: font,
          size: 0.8,
          depth: 0.1,
          curveSegments: 22,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelEnabled: true,
        })

        const material = new THREE.MeshBasicMaterial({ color: colorText })
        const textMesh = new THREE.Mesh(textGeo, material)
        textMesh.position.x = pos_x - (device_name.length * 0.7) / 2
        textMesh.position.y = Math.round(pos_z + box_z) + 0.3
        textMesh.position.z = pos_y

        textMesh.rotation.x = 0
        textMesh.rotation.y = 0
        textMesh.rotation.z = Math.PI * 2
        this.scene.add(textMesh)
      })
  }

  loadDevices() {
    console.log('loadDevices')
    return this.devicesService.GetDevices().subscribe((data: Device[]): void => {
      this.deviceList = data
    })
  }

  loadModels() {
    console.log('loadModels')
    return this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data
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
    console.log('Create device list 3d')
    console.log('Device list: ' + this.deviceList.length)
    console.log('Model list: ' + this.modelList.length)
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
    console.log('Created devices:', createdDevices.join('; '))
  }

  addWalls() {
    const geometry = new THREE.BoxGeometry(51, 10, 1)
    const geometry2 = new THREE.BoxGeometry(1, 10, 51)

    const object1 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
    const object2 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
    const object3 = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
    const object4 = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))

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
    const light = new THREE.DirectionalLight(0xffffff, 2)
    light.position.set(30, 10, 50)
    light.castShadow = true

    light.position.set(15, 20, 10)
    light.castShadow = true // default false
    light.shadow.camera.near = 0.5 // adjusted to a typical value
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 3000 // default
    light.shadow.mapSize.height = 3000 // default
    light.shadow.camera.near = 1000 // default
    light.shadow.camera.far = 2000 // default

    this.scene.add(light)

    const lightHelper = new THREE.DirectionalLightHelper(light, 1)
    this.scene.add(lightHelper)
  }

  addDirectionalLight1() {
    const light2 = new THREE.DirectionalLight(0xffffff, 2)
    light2.position.set(-20, 30, 50)
    light2.castShadow = true
    light2.shadow.camera.bottom = -10
    light2.shadow.camera.far = 2000
    light2.shadow.camera.left = -10
    light2.shadow.camera.near = 1000 // default
    light2.shadow.camera.right = 10
    light2.shadow.camera.top = 10
    light2.shadow.mapSize.height = 3000 // default
    light2.shadow.mapSize.width = 3000 // default
    this.scene.add(light2)

    const lightHelper2 = new THREE.DirectionalLightHelper(light2, 8, 0xff0000)
    this.scene.add(lightHelper2)
  }

  addDirectionalLight2() {
    const light3 = new THREE.DirectionalLight(0xffffff, 3)
    light3.color.setHSL(0.1, 1, 0.95)
    light3.position.set(20, 40, 25)
    light3.castShadow = true
    light3.shadow.camera.bottom = -10
    light3.shadow.camera.far = 2000 // default
    light3.shadow.camera.left = -10
    light3.shadow.camera.near = 1000 // default
    light3.shadow.camera.right = 10
    light3.shadow.camera.top = 10
    light3.shadow.mapSize.height = 3000 // default
    light3.shadow.mapSize.width = 3000 // default
    this.scene.add(light3)

    const lightHelper3 = new THREE.DirectionalLightHelper(light3, 20, 0x00ff00)
    lightHelper3.position.set(40, 40, 45)

    lightHelper3.castShadow = true
    this.scene.add(lightHelper3)
  }

  addAmbientLight() {
    const color = 0xffffff
    const intensity = 0.9
    const lightAmbient = new THREE.AmbientLight(color, intensity)
    lightAmbient.castShadow = true
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
          curveSegments: 8,
          bevelThickness: 0.1,
          bevelSize: 0.1,
          bevelEnabled: true,
        })

        const material = new THREE.MeshBasicMaterial({ color: 0x995050 })
        const textMesh = new THREE.Mesh(textGeo, material)
        textMesh.position.x = -18
        textMesh.position.y = 2
        textMesh.position.z = 25

        textMesh.rotation.x = 0
        textMesh.rotation.y = Math.PI * 2
        this.scene.add(textMesh)
      })
  }

  addAxis() {
    const axesHelper = new THREE.AxesHelper(35)
    this.scene.add(axesHelper)
  }

  private createScene() {
    console.log('Create scene')
    this.scene = new THREE.Scene()

    const planeSize = 80
    this.addPlane(planeSize)

    this.scene.background = new THREE.Color(0x555555)
    // Removed invalid properties castShadow and receiveShadow from THREE.Scene

    this.scene.fog = new THREE.Fog(0x333333, 200, 1500)

    this.addWalls()

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
