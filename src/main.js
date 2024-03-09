import "../style.css"

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import * as CANNON from "cannon-es"
import CannonDebugger from "cannon-es-debugger"

const SPHERE_RADIUS = 1

const renderer = new THREE.WebGLRenderer()

renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelpers = new THREE.AxesHelper(3)
scene.add(axesHelpers)

camera.position.set(10, 10, 10)
orbit.update()

const physicsWorld = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0)
})

const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane()
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
physicsWorld.addBody(groundBody)

const sphereBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Sphere(SPHERE_RADIUS)
})
sphereBody.position.set(0, 7, 0)
physicsWorld.addBody(sphereBody)

const sphereGeometry = new THREE.SphereGeometry(SPHERE_RADIUS)
const sphereMaterial = new THREE.MeshNormalMaterial()
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphereMesh)
sphereMesh.position.set(0, 7, 0)

const boxBody = new CANNON.Body({
    mass: 5,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1))
})
physicsWorld.addBody(boxBody)
boxBody.position.set(1, 10, 0)

const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshNormalMaterial())
scene.add(boxMesh)
boxMesh.position.set(1, 10, 0)

const cannonDebugger = new CannonDebugger(scene, physicsWorld)

function animate() {
    renderer.render(scene, camera)
    physicsWorld.fixedStep()
    cannonDebugger.update()

    sphereMesh.position.copy(sphereBody.position)
    sphereMesh.quaternion.copy(sphereBody.quaternion)

    boxMesh.position.copy(boxBody.position)
    boxMesh.quaternion.copy(boxBody.quaternion)
}

renderer.setAnimationLoop(animate)

