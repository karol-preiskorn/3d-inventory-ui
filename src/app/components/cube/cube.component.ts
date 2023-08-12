/*
 * File:        /src/app/cube/cube.component.ts
 *
 * Description: First tree.js component
 *
 * Todo:
 *   [x] add cube
 *   [ ] add cube from Angular
 *   [ ] add cube with defined in Ng parameters.
 *
 * Used by:
 *
 * Dependency:
 *
 * Date         By      Comments
 * ----------   -----   ------------------------------
 * 2023-08-08   C2RLO   Starting developing Racks
 * 2023-07-13   C2RLO   Get cube from
 * 2023-04-16   C2RLO   Add cube
 */

import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core'
import {Router} from '@angular/router'
import {v4 as uuidv4} from 'uuid'
import {faker} from '@faker-js/faker'

import * as THREE from 'three'
import {OrbitControls} from 'three-orbitcontrols-ts'

import {adjectives, animals, colors, uniqueNamesGenerator} from 'unique-names-generator'

import {LogService} from 'src/app/services/log.service'

import {DeviceService} from 'src/app/services/device.service'
import {Device} from 'src/app/shared/device'

import {ModelsService} from 'src/app/services/models.service'
import {Model} from 'src/app/shared/model'

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss'],
})
export class CubeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef: ElementRef

  @Input() public rotationSpeedX = 0.002
  @Input() public rotationSpeedY = 0.003
  @Input() public size = 10
  @Input() public texture = '/assets/r710-2.5-nobezel__29341.png'

  @Input() public cameraZ = 1000
  @Input() public fieldOfView = 1
  @Input('nearClipping') public nearClippingPlane = 1
  @Input('farClipping') public farClippingPlane = 3000

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

  private racks: Array<Device> = []
  private deviceList: Device[] = []
  private modelList: Model[] = []

  component = 'Cube'

  constructor(
    private devicesService: DeviceService,
    private modelsService: ModelsService,
    private logService: LogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDevices()
    this.loadModels()
  }

  ngAfterViewInit() {
    this.createScene()
    this.startRenderingLoop()
  }

  addRandomCubes() {
    for (let i = 0; i < 9; i++) {
      this.addServer(2, 1, 3, Math.random() * 40 - 20, this.getRandomH(), Math.random() * 40 - 20)
    }
  }

  getRandomX = () => Math.round(Math.random() * 40 - 20)
  getRandomY = () => Math.round(Math.random() * 40 - 20)
  getRandomH = () => Math.round(Math.random() * 9)

  checkDistace() {
    let x = this.getRandomX()
    let y = this.getRandomY()
    let distance = true
    let counter = 0
    while (distance == true && counter < 9) {
      this.racks.forEach((element) => {
        // console.log('Generate rack (' + x + ', ' + y + ') ' + Math.sqrt(Math.pow(Math.abs(x - element.x), 2) + Math.pow(Math.abs(y - element.y), 2)))
        if (
          Math.sqrt(Math.pow(Math.abs(x - element.position.x), 2) + Math.pow(Math.abs(y - element.position.y), 2)) < 6
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

  generateRack(): Device {
    return {
      id: uuidv4(),
      name: faker.company.name() + ' - ' + faker.company.buzzPhrase(),
      position: {
        x: this.getRandomX(),
        y: this.getRandomY(),
        h: this.getRandomH(),
      },
      // modelId: this.modelList[Math.floor(Math.random() * this.modelList.length)].id
      modelId: '1',
    } as Device
  }

  generateRandomRack() {
    this.checkDistace()
    this.racks.push(this.generateRack())
  }

  generateRandomRacks(count: number) {
    for (let i = 0; i < count; i++) {
      this.generateRandomRack()
    }
  }

  createRacks(): void {
    this.racks.forEach((element) => {
      this.addRack(element.position.x, element.position.y)
    })
  }

  addRack(floor_x: number, floor_y: number): void {
    const n_servers = Math.round(Math.random() * 9)
    for (let i = 0; i < n_servers; i++) {
      this.addServer(3, 1, 3, floor_x, i + 0.5, floor_y)
    }
  }

  addServer(box_x: number, box_y: number, box_z: number, pos_x: number, pos_y: number, pos_z: number) {
    const geometry = new THREE.BoxGeometry(box_x, box_y, box_z)
    const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}))

    object.position.x = pos_x
    object.position.y = pos_y
    object.position.z = pos_z

    //console.log('addServer: ' + JSON.stringify(object.position))

    this.scene.add(object)
  }

  loadDevices() {
    return this.devicesService.GetDevices().subscribe((data: any) => {
      this.deviceList = data
    })
  }

  loadModels() {
    return this.modelsService.GetModels().subscribe((data: Model[]): void => {
      this.modelList = data as Model[]
    })
  }

  addWalls() {
    const geometry = new THREE.BoxGeometry(50, 10, 1)
    const geometry2 = new THREE.BoxGeometry(1, 10, 50)
    const object1 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}))
    const object2 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}))
    const object3 = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}))
    const object4 = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}))
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
    const light = new THREE.DirectionalLight(0xddb14c, 1.5)
    light.position.set(200, 200, 200).normalize()
    const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
    this.scene.add(cameraHelper)
    this.scene.add(light)
  }

  addLight2() {
    const light2 = new THREE.DirectionalLight(0xeefccf, 2)
    light2.position.set(-200, 80, 150).normalize()
    const cameraHelper2 = new THREE.CameraHelper(light2.shadow.camera)
    this.scene.add(cameraHelper2)
    this.scene.add(light2)
  }

  addAbientLight() {
    const color = 0xf0f0f0
    const intensity = 0.1
    const lightAbient = new THREE.AmbientLight(color, intensity)
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
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -0.5
    this.scene.add(mesh)
  }

  private createScene() {
    this.scene = new THREE.Scene()

    const planeSize = 80
    this.addPlane(planeSize)

    this.scene.background = new THREE.Color(0x555555)

    this.addLight()
    this.addLight2()
    //this.addAbientLight()

    this.addWalls()

    this.generateRandomRacks(30)
    this.createRacks()

    // const color = 0xF29900
    // const intensity = 23
    // const light = new THREE.DirectionalLight(color, intensity)
    // light.position.set(100, 100, -100).normalize()
    // const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
    // this.scene.add(cameraHelper)

    const aspectRatio = this.getAspectRatio()
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = 1800
    this.camera.position.x = 1600
    this.camera.position.y = 1400
    const controls = new OrbitControls(this.camera, this.canvas)
    this.camera.zoom = 2 // Set to false to disable zooming
    //THREE.zoomSpeed = 1.0
    controls.target.set(5, 5, 0)

    controls.enablePan = false // Set to false to disable panning (ie vertical and horizontal translations)
    controls.update()
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas})
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

    const component: CubeComponent = this
    ;(function render() {
      requestAnimationFrame(render)
      component.animateCube()
      component.shadowCube()
      component.renderer.render(component.scene, component.camera)
    })()
  }
}
