/*
 * File:        /src/app/cube/cube.component.ts
 * Description: First tree.js component
 * Todo:
 *   [ ] add cube
 *   [ ] add cube from Angular
 *   [ ] add cube with defined in Ng parameters.
 * Used by:
 * Dependency:
 *
 * Date         By        Comments
 * ----------   -------   ------------------------------
 * 2023-04-16   C2RLO     Add cube
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core'
import * as THREE from 'three'

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
  @Input('farClipping') public farClippingPlane = 1500

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

  addCubes() {
    const geometry = new THREE.BoxGeometry(2, 3, 3)

    for (let i = 0; i < 100; i++) {
      const object = new THREE.Mesh(
        geometry,
        new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
      )

      object.position.x = Math.random() * 40 - 20
      object.position.y = Math.random() * 40 - 20
      object.position.z = Math.random() * 40 - 20

      object.rotation.x = Math.random() * 8 * Math.PI
      object.rotation.y = Math.random() * 88 * Math.PI
      object.rotation.z = Math.random() * 8 * Math.PI

      object.scale.x = Math.random() + 0.6
      object.scale.y = Math.random() + 0.5
      object.scale.z = Math.random() + 0.5

      console.log(
        JSON.stringify(object.position) + JSON.stringify(object.rotation)
      )

      this.scene.add(object)
    }
  }

  addFloor() {
    const geometry = new THREE.BoxGeometry(100, 100, 1)
    const object = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff })
    )
    console.log(
      JSON.stringify(object.position) + JSON.stringify(object.rotation)
    )
    this.scene.add(object)
  }

  addLight() {
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(1, 1, 1).normalize()
    this.scene.add(light)
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
  private createScene() {
    //* Scene
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x202020)
    this.addLight()
    //this.scene.add(this.cube)
    this.addCubes()
    console.log(JSON.stringify(this.cube.rotation))
    this.addFloor()
    //*Camera
    const aspectRatio = this.getAspectRatio()
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPlane,
      this.farClippingPlane
    )
    this.camera.position.z = 1000
    this.camera.position.x = 10
    //this.cameraZ +
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
    ;(function render() {
      requestAnimationFrame(render)
      component.animateCube()
      component.renderer.render(component.scene, component.camera)
    })()
  }

  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.createScene()
    this.startRenderingLoop()
  }
}
