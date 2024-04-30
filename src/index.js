import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from "stats.js"
import size from "./utils/size"
import "./style.css"

/**
 * Base
 */

const canvas = document.querySelector("canvas")
const scene = new THREE.Scene()
const clock = new THREE.Clock()
const textureLoader = new THREE.TextureLoader()

/**
 * Textures
 */

const displacementTexture = textureLoader.load("/textures/displacementMap.png")
displacementTexture.wrapS = THREE.RepeatWrapping
displacementTexture.wrapT = THREE.RepeatWrapping
displacementTexture.repeat.set(1, 1)
displacementTexture.offset.set(0, 0)

/**
 * Camera
 */

// Base camera
const camera = new THREE.PerspectiveCamera(75, size.aspectRatio, 0.1, 100)
camera.position.set(2, 2, 6)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    powerPreference: "high-performance",
    antialias: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Test meshes
 */

// Plane
const planeGeometry = new THREE.PlaneGeometry(16, 16, 32, 32)
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    displacementMap: displacementTexture,
    displacementScale: 0.1,
    displacementBias: 0.5,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
planeGeometry.rotateX(Math.PI / 2)
plane.receiveShadow = true
scene.add(plane)

// Torus knot
const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotBufferGeometry(1, 0.3, 100, 16),
    new THREE.MeshPhongMaterial({
        color: 0xffffff,
        displacementMap: displacementTexture,
        displacementScale: 0.1,
        displacementBias: 0.5,
        wireframe: false
    })
)
scene.add(torusKnot)

/**
 * Lightning
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.set(10, 10, 10)
pointLight.castShadow = true
scene.add(pointLight)

/**
 * FPS stats
 */

const stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

/**
 * Resizing function
 */

window.addEventListener("resize", () => {
    camera.aspect = size.aspectRatio
    camera.updateProjectionMatrix()
    renderer.setSize(size.width, size.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Animate
 */

const tick = () => {
    stats.begin()

    // const elapsedTime = clock.getElapsedTime()

    // Update test mesh
    // torusKnot.rotation.y = elapsedTime * 0.1

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
    stats.end()
}

tick()