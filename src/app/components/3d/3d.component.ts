/**
 * @description: First tree.js component
 * @todo:
 *   [ ] ashow cue diefinied in 3d-inventory db
 *   [ ] add cube from Angular
 *
 * @version: 2023-08-08   C2RLO   Starting developing Racks
 * @version: 2023-07-13   C2RLO   Get cube from
 * @version: 2023-04-16   C2RLO   Add cube
 */

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { v4 as uuidv4 } from 'uuid'

import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { faker } from '@faker-js/faker'

import { DeviceService } from '../../services/device.service'
import { LogService } from '../../services/log.service'
import { ModelsService } from '../../services/models.service'
import { Device } from '../../shared/device'
import { Model } from '../../shared/model'

@Component({
  selector: 'app-cube',
  templateUrl: './3d.component.html',
  styleUrls: ['./3d.component.scss'],
})
export class CubeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef: ElementRef

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

  //private material = new THREE.ShadowMaterial()

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material)

  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene

  private racks: Array<Device> = []
  private deviceList: Device[] = []
  private modelList: Model[] = []

  component = 'Cube'

  constructor(
    private devicesService: DeviceService,
    private modelsService: ModelsService,
    private logService: LogService,
    private router: Router,
  ) {
    this.material.opacity = 0.8
    this.cube.receiveShadow = true
  }

  ngOnInit(): void {
    // this.loadDevices()
    // this.loadModels()
  }

  ngAfterViewInit() {
    this.createScene()
    this.startRenderingLoop()
  }

  getRandomX = () => Math.round(Math.random() * 40 - 20)
  getRandomY = () => Math.round(Math.random() * 40 - 20)
  getRandomH = () => Math.round(Math.random() * 10)

  checkDistanceInDeviceList() {
    let x = this.getRandomX()
    let y = this.getRandomY()
    let distance = true
    let counter = 0
    while (distance == true && counter < 10) {
      this.racks.forEach((element) => {
        // console.log('Generate rack (' + x + ', ' + y + ') ' + Math.sqrt(Math.pow(Math.abs(x - element.x), 2) + Math.pow(Math.abs(y - element.y), 2)))
        if (
          Math.sqrt(Math.pow(Math.abs(x - element.position.x), 2) + Math.pow(Math.abs(y - element.position.y), 2)) < 8
        ) {
          distance = false
        }
        counter = counter + 1
      })
      if (distance == (false as boolean)) {
        x = this.getRandomX()
        y = this.getRandomY()
        // distance = true
      }
      counter = counter + 1
    }
  }

  generateRandomDeviceRack(): Device {
    return {
      _id: uuidv4.toString(),
      name: faker.company.name() + ' - ' + faker.company.buzzPhrase(),
      position: {
        x: this.getRandomX(),
        y: this.getRandomY(),
        h: this.getRandomH(),
      },
      // modelId: this.modelList[Math.floor(Math.random() * this.modelList.length)].id
      modelId: this.modelList[Math.floor(Math.random() * this.modelList.length)]._id,
    } as Device
  }

  generateRacksList(count: number) {
    for (let i = 0; i < count; i++) {
      this.checkDistanceInDeviceList()
      this.racks.push(this.generateRandomDeviceRack())
    }
  }

  createRacksList3d(): void {
    this.racks.forEach((element) => {
      this.createRack3d(element.position.x, element.position.y, Math.round(Math.random() * 10))
    })
  }

  createRack3d(floor_x: number, floor_y: number, h: number): void {
    for (let i = 0; i < h; i++) {
      this.createDevice3d(3, 1, 3, floor_x, i + 0.5, floor_y)
    }
  }

  createDevice3d(box_x: number, box_y: number, box_z: number, pos_x: number, pos_y: number, pos_z: number) {
    const geometry = new THREE.BoxGeometry(box_x, box_y, box_z)
    this.material.color = new THREE.Color(Math.random() * 0xffffff)
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff })
    this.material.opacity = 0.75

    const object = new THREE.Mesh(
      geometry,
      sphereMaterial /* new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }) */,
    )
    object.position.x = pos_x
    object.position.y = pos_y
    object.position.z = pos_z
    object.castShadow = true
    object.receiveShadow = true
    this.scene.add(object)
  }

  loadDevices() {
    return this.devicesService.GetDevices().subscribe((data: Device[]) => {
      this.deviceList = data as Device[]
    })
  }

  loadModels() {
    return this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data as Model[]
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

    light.position.set(15, 20, 10)
    light.castShadow = true // default false

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 3000 // default
    light.shadow.mapSize.height = 3000 // default
    light.shadow.camera.near = 1000 // default
    light.shadow.camera.far = 2000 // default

    this.scene.add(light)

    const lightHelper = new THREE.DirectionalLightHelper(light, 1)
    this.scene.add(lightHelper)
  }

  directionalLight() {
    const light2 = new THREE.DirectionalLight(0xffffff, 1.3)
    light2.position.set(-20, 30, 20)
    light2.castShadow = true
    this.scene.add(light2)

    const lightHelper2 = new THREE.DirectionalLightHelper(light2, 1)
    this.scene.add(lightHelper2)
  }

  directionalLight2() {
    const light3 = new THREE.DirectionalLight(0xffffff, 0.8)
    light3.position.set(20, 20, 25)
    light3.castShadow = true
    this.scene.add(light3)

    const lightHelper3 = new THREE.DirectionalLightHelper(light3, 1)
    this.scene.add(lightHelper3)
  }

  addAbientLight() {
    const color = 0xffffff
    const intensity = 0.9
    const lightAbient = new THREE.AmbientLight(color, intensity)
    lightAbient.castShadow = true
    this.scene.add(lightAbient)
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
    // const planeMat = new THREE.MeshPhongMaterial({
    //   map: texture,
    //   side: THREE.DoubleSide,
    //   shadowSide: 2
    // })
    const planeMat = new THREE.MeshStandardMaterial({ color: 0xffffff })

    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.receiveShadow = true
    // mesh.castShadow = true
    mesh.rotation.x = Math.PI * -0.5
    this.scene.add(mesh)
  }

  private createScene() {
    this.scene = new THREE.Scene()

    const planeSize = 80
    this.addPlane(planeSize)

    this.scene.background = new THREE.Color(0x555555)
    this.scene.castShadow = true
    this.scene.receiveShadow = true

    this.addWalls()
    // this.generateRacksList(25)
    // this.createRacksList3d()

    this.directionalLight()
    this.directionalLight2()
    //this.addLight()
    //this.addAbientLight()

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
