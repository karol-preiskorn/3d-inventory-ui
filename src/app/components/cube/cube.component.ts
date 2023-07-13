/*
 * File:        /src/app/cube/cube.component.ts
 * Description: First tree.js component
 * Todo:
 *   [x] add cube
 *   [ ] add cube from Angular
 *   [ ] add cube with defined in Ng parameters.
 * Used by:
 * Dependency:
 *
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-07-13   C2RLO     Get cube from
 * 2023-04-16   C2RLO     Add cube
 */
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'

import * as THREE from 'three'
import { OrbitControls } from 'three-orbitcontrols-ts'

import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'

import { LogService } from 'src/app/services/log.service'

import { DeviceService } from 'src/app/services/device.service'
import { Device } from 'src/app/shared/device'

import { ModelsService } from 'src/app/services/models.service'
import { Model } from 'src/app/shared/model'

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss'],
})
export class CubeComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas')
  private canvasRef: ElementRef

  //* Cube Properties

  @Input() public rotationSpeedX = 0.002
  @Input() public rotationSpeedY = 0.003
  @Input() public size = 10
  @Input() public texture = '/assets/r710-2.5-nobezel__29341.png'

  //* Stage Properties

  @Input() public cameraZ = 1000
  @Input() public fieldOfView = 1
  @Input('nearClipping') public nearClippingPlane = 1
  @Input('farClipping') public farClippingPlane = 3000

  //? Helper Properties (Private Properties);

  private camera!: THREE.PerspectiveCamera

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement
  }
  private loader = new THREE.TextureLoader()
  private geometry = new THREE.BoxGeometry(4, 2, 1)
  private material = new THREE.MeshBasicMaterial({
    map: this.loader.load(this.texture),
  })

  // material.env = envTexture

  private cube: THREE.Mesh = new THREE.Mesh(this.geometry, this.material)
  private renderer!: THREE.WebGLRenderer
  private scene!: THREE.Scene

  private racks: Array<{ x: number; y: number; name: string }> = []
  private deviceList: Device[] = []
  private modelList: Model[] = []
  component = 'Cube'

  addRandomCubes() {
    for (let i = 0; i < 10; i++) {
      this.addServer(2, 1, 3, Math.random() * 40 - 20, Math.random() * 9 + 0.5, Math.random() * 40 - 20)
    }
  }

  generateRandomRack() {
    let x = Math.random() * 45 - 22
    let y = Math.random() * 45 - 22
    let distance = true
    let counter = 0

    console.log('Start Generate Rack: (' + x + ', ' + y + ')')

    while (distance == true && counter < 10) {
      this.racks.forEach((element) => {
        // console.log('Generate rack (' + x + ', ' + y + ') ' + Math.sqrt(Math.pow(Math.abs(x - element.x), 2) + Math.pow(Math.abs(y - element.y), 2)))
        if (Math.sqrt(Math.pow(Math.abs(x - element.x), 2) + Math.pow(Math.abs(y - element.y), 2)) < 6) {
          distance = false
        }
        counter = counter + 1
      })

      if (distance == false as boolean) {
        x = Math.random() * 45 - 22
        y = Math.random() * 45 - 22
        // distance = true
      }
      counter = counter + 1
    }

    console.log('Generate Rack: (' + x + ', ' + y + ')')
    this.racks.push({
      x: x,
      y: y,
      name: uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        style: 'lowerCase',
        separator: '-'
      })
    })
  }

  generateRandomRacks(count: number) {
    for (let i = 0; i < count; i++) {
      this.generateRandomRack()
    }
  }

  createRacks(): void {
    this.racks.forEach((element) => {
      this.addRack(element.x, element.y)
    })
  }

  addRack(floor_x: number, floor_y: number): void {
    const n_servers = Math.round(Math.random() * 10)
    for (let i = 0; i < n_servers; i++) {
      this.addServer(3, 1, 3, floor_x, i + 0.5, floor_y)
    }
  }

  addServer(box_x: number, box_y: number, box_z: number, pos_x: number, pos_y: number, pos_z: number) {
    const geometry = new THREE.BoxGeometry(box_x, box_y, box_z)
    const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))

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
    const object1 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
    const object2 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
    const object3 = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
    const object4 = new THREE.Mesh(geometry2, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }))
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
    const light = new THREE.DirectionalLight(0xddb14c, 0.3)
    light.position.set(100, 100, 100).normalize()
    this.scene.add(light)
  }

  addLight2() {
    const light2 = new THREE.DirectionalLight(0xdbc29e, 0.3)
    light2.position.set(-100, 50, -100).normalize()
    this.scene.add(light2)
  }

  addAbientLight() {
    const color = 0xffffff
    const intensity = 0.1
    const lightAbient = new THREE.AmbientLight(color, intensity)
    this.scene.add(lightAbient)
  }

  /**
   *Animate the cube
   *
   * @private
   * @memberof CubeComponent
   */
  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX
    this.cube.rotation.y += this.rotationSpeedY
  }

  /**
   * Create the scene
   *
   * @private
   * @memberof CubeComponent
   */
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
    const planeSize = 50

    this.addPlane(planeSize)

    this.scene.background = new THREE.Color(0x252525)

    this.addLight()
    this.addLight2()
    this.addAbientLight()

    this.addWalls()

    this.generateRandomRacks(60)
    this.createRacks()

    const aspectRatio = this.getAspectRatio()
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = 1800
    this.camera.position.x = 1600
    this.camera.position.y = 1300
    const controls = new OrbitControls(this.camera, this.canvas)
    //THREE.enableZoom = true // Set to false to disable zooming
    //THREE.zoomSpeed = 1.0
    controls.target.set(0, 0, 0)

    controls.enablePan = true // Set to false to disable panning (ie vertical and horizontal translations)
    controls.update()
  }

  private getAspectRatio() {
    return this.canvas.clientWidth / this.canvas.clientHeight
  }

  /**
   * Start the rendering loop
   *
   * @private
   * @memberof CubeComponent
   */
  private startRenderingLoop() {
    //* Renderer
    // Use canvas element in template
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight)

    const component: CubeComponent = this
      ; (function render() {
        requestAnimationFrame(render)
        component.animateCube()
        component.renderer.render(component.scene, component.camera)
      })()
  }

  constructor(
      private devicesService: DeviceService,
      private modelsService: ModelsService,
      private logService: LogService,
      private router: Router,
      ) { }

  ngOnInit(): void {
    this.loadDevices()
    this.loadModels()
  }

  ngAfterViewInit() {
    this.createScene()
    this.startRenderingLoop()
  }
}
