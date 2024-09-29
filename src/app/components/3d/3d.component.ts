/**
 * @description: 3D component for Angular
 * @todo:
 *   [ ] show cue diefinied in 3d-inventory DB.
 *   [ ] add cube from Angular.
 *
 * @version: 2023-08-08   C2RLO   Starting developing Racks
 * @version: 2023-07-13   C2RLO   Get cube from
 * @version: 2023-04-16   C2RLO   Add cube
 */

import { Observable } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';

import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tr } from '@faker-js/faker';

import { DeviceService } from '../../services/device.service';
import { ModelsService } from '../../services/models.service';
import { Device } from '../../shared/device';
import { Model } from '../../shared/model';

const materials = [
  new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
  new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
]

@Component({
  selector: 'app-cube',
  templateUrl: './3d.component.html',
  styleUrls: ['./3d.component.scss'],
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

  private material = new THREE.MeshBasicMaterial({
    map: this.loader.load(this.texture),
  })

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
    this.deviceList = this.route.snapshot.data.resolveDeviceList
    this.modelList = this.route.snapshot.data.resolveModelList
    // this.loadDevices()
    // this.loadModels()
  }

  constructor(
    private devicesService: DeviceService,
    private modelsService: ModelsService,
    private HttpClient: HttpClient,
    private route: ActivatedRoute,
  ) {
    console.log('constructor')
    this.material.opacity = 1
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

  createDevice3d(box_x: number, box_y: number, box_z: number, pos_x: number, pos_y: number, pos_z: number) {
    console.log('createDevice3d parameters: ', box_x, box_y, box_z, pos_x, pos_y, pos_z)
    const geometry = new THREE.BoxGeometry(box_x, box_y, box_z)
    this.material.color = new THREE.Color(Math.random() * 0xffffff)
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    this.material.opacity = 1

    const object = new THREE.Mesh(geometry, sphereMaterial)
    object.position.x = pos_x
    object.position.y = pos_z
    object.position.z = pos_y
    object.castShadow = true
    object.receiveShadow = true
    this.scene.add(object)
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
    let model = this.modelList.find((e: Model) => e._id === id)?.name as string
    if (model === undefined) {
      model = 'Unknown'
    }
    return model
  }

  createDeviceList3d(): void {
    console.log('Create device list 3d')
    console.log('Device list: ' + this.deviceList.length)
    console.log('Model list: ' + this.modelList.length)
    this.deviceList.forEach((device: Device) => {
      const model: Model = this.modelList.find((e: Model) => e._id === device.modelId) as Model
      this.createDevice3d(
        model.dimension.width,
        model.dimension.height,
        model.dimension.depth,
        device.position.x,
        device.position.y,
        device.position.h,
      )
      console.log('Create device: ' + device.name + ' ' + device.position.x + ' ' + device.position.y)
    })
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

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 3000 // default
    light.shadow.mapSize.height = 3000 // default
    light.shadow.camera.near = 1000 // default
    light.shadow.camera.far = 3000 // default

    this.scene.add(light)

    const lightHelper = new THREE.DirectionalLightHelper(light, 1)
    this.scene.add(lightHelper)
  }

  directionalLight() {
    const light2 = new THREE.DirectionalLight(0xffffff, 1.3)
    light2.position.set(-35, 35, 20)
    light2.castShadow = true
    this.scene.add(light2)

    const lightHelper2 = new THREE.DirectionalLightHelper(light2, 2)
    this.scene.add(lightHelper2)
  }

  directionalLight3() {
    const light3 = new THREE.DirectionalLight(0xffffff, 1)
    light3.position.set(30, 20, 25)
    light3.castShadow = true
    this.scene.add(light3)

    const lightHelper3 = new THREE.DirectionalLightHelper(light3, 1)
    this.scene.add(lightHelper3)
  }

  addAmbientLight() {
    const color = 0xffffff
    const intensity = 2
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
    new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
    new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
  ]

  textMesh1: THREE.Mesh
  group = new THREE.Group()

  addText() {
    const text = '3d Inventory'
    const loader = new FontLoader()
    this.addTextOnWall(loader, text)
  }

  private addTextOnWall(loader: FontLoader, text: string) {
    loader.load('./../../../assets/fonts/Fira Code Retina_Regular.json', (font: Font) => {
      const textGeo = new TextGeometry(text, {
      font: font,
      size: 4,
      height: 1,
      curveSegments: 8,
      bevelThickness: 0.1,
      bevelSize: 0.1,
      bevelEnabled: true,
      })

      const material = new THREE.MeshBasicMaterial({ color: 0x995050 })
      const textMesh = new THREE.Mesh(textGeo, material)
      textMesh.position.x = -18
      textMesh.position.y = 5
      textMesh.position.z = 25

      textMesh.rotation.x = 0
      textMesh.rotation.y = Math.PI * 2
      this.scene.add(textMesh)
    },
    undefined,
    (error) => {
      console.error('An error occurred while loading the font:', error)
    })
  }

  addAxis() {
    const axesHelper = new THREE.AxesHelper(45)
    this.scene.add(axesHelper)

    const loader = new FontLoader()
    loader.load('./../../../assets/fonts/Fira Code Retina_Regular.json', (font: Font) => {
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

      const createTextMesh = (text: string, position: THREE.Vector3) => {
        const textGeo3 = new TextGeometry(text, {
          font: font,
          size: 4,
          depth: 1,
        })
        const textMesh = new THREE.Mesh(textGeo3, textMaterial)
        textMesh.position.copy(position)
        this.scene.add(textMesh)
      }

      createTextMesh('X', new THREE.Vector3(36, 0, 0))
      createTextMesh('Y', new THREE.Vector3(0, 36, 0))
      createTextMesh('Z', new THREE.Vector3(0, 0, 36))
    })
  }

  private createScene() {
    console.log('Create scene')
    this.scene = new THREE.Scene()

    const planeSize = 80
    this.addPlane(planeSize)

    this.scene.background = new THREE.Color(0x555555)
    this.scene.castShadow = true
    this.scene.receiveShadow = true

    //this.scene.fog = new THREE.Fog(0x333333, 200, 1500)

    this.addWalls()

    this.directionalLight()
    this.directionalLight3()

    this.addText()
    this.addAxis()

    // this.loadDevices()
    // this.loadModels()

    this.createDeviceList3d()

    const aspectRatio = this.getAspectRatio()
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane,
    )
    this.camera.position.z = 500
    this.camera.position.x = 500
    this.camera.position.y = 500
    const controls = new OrbitControls(this.camera, this.canvas)
    this.camera.zoom = 0.7
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

    const fov = 1000
    const aspect = 1 // the canvas default
    const near = 0.01
    const far = 3000
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

    camera.position.set(10, 20, 20)

    const controls = new OrbitControls(camera, this.canvas)
    controls.target.set(10, 40, 30)
    controls.update()

    // Remove the aliasing of 'this'
    // https://stackoverflow.com/questions/20279484/how-to-access-the-correct-this-inside-a-callback
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
    //
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const component: CubeComponent = this
    ;(function render() {
      requestAnimationFrame(render)
      component.animateCube()
      component.shadowCube()
      component.renderer.render(component.scene, component.camera)
    })()
  }
}
