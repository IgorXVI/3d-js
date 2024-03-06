import "../style.css"

import * as three from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

import * as dat from "dat.gui"

const renderer = new three.WebGLRenderer()

const monkeyUrl = new URL("../assets/monkey.glb", import.meta.url)

renderer.shadowMap.enabled = true

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const scene = new three.Scene()

const camera = new three.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const orbit = new OrbitControls(camera, renderer.domElement)

const axesHelpers = new three.AxesHelper(3)
scene.add(axesHelpers)

camera.position.set(-10, 30, 30)
orbit.update()

const boxGeometry = new three.BoxGeometry()
const boxMaterial = new three.MeshBasicMaterial({ color: 0x00ff00 })
const box = new three.Mesh(boxGeometry, boxMaterial)
scene.add(box)


const planeGeometry = new three.PlaneGeometry(30, 30)
const planeMaterial = new three.MeshStandardMaterial({ color: 0xffffff, side: three.DoubleSide })
const plane = new three.Mesh(planeGeometry, planeMaterial)
scene.add(plane)
plane.rotation.x = -0.5 * Math.PI
plane.receiveShadow = true

const gridHelper = new three.GridHelper(30)
scene.add(gridHelper)

const sphereGeometry = new three.SphereGeometry(4, 50, 50)
const sphereMaterial = new three.MeshStandardMaterial({ color: 0x0000ff })
const sphere = new three.Mesh(sphereGeometry, sphereMaterial)
scene.add(sphere)
sphere.castShadow = true

sphere.position.set(-10, 10, 0)

// const ambientLight = new three.AmbientLight(0xffffff)
// scene.add(ambientLight)

// const directionalLight = new three.DirectionalLight(0xffffff, 5)
// scene.add(directionalLight)
// directionalLight.position.set(-30, 50, 0)
// directionalLight.castShadow = true
// directionalLight.shadow.camera.bottom = -14
// directionalLight.shadow.camera.top = 14

// const directionalLightHelper = new three.DirectionalLightHelper(directionalLight, 5)
// scene.add(directionalLightHelper)

// const shadowHelper = new three.CameraHelper(directionalLight.shadow.camera)
// scene.add(shadowHelper)

const spotLight = new three.SpotLight(0xffffff, 100000)
scene.add(spotLight)
spotLight.position.set(-100, 100, 0)
spotLight.castShadow = true
spotLight.angle = 0.2

const spotLightHelper = new three.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

const plane2Geometry = new three.PlaneGeometry(10, 10, 10, 10)
const plane2Material = new three.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
const plane2 = new three.Mesh(plane2Geometry, plane2Material)
scene.add(plane2)
plane2.position.set(10, 10, 15)

plane2.geometry.attributes.position.array[0] -= 10 * Math.random()
plane2.geometry.attributes.position.array[1] -= 10 * Math.random()
plane2.geometry.attributes.position.array[2] -= 10 * Math.random()
const lastPointZ = plane2.geometry.attributes.position.array.length - 1
plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random()

// const vShader = `
//     void main() {
//         gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
// `

// const fShader = `
//     void main() {
//         gl_FragColor = vec4(0.5, 0.5, 1.0, 1.0);
//     }
// `

const sphere2Geometry = new three.SphereGeometry(4)
const sphere2Material = new three.ShaderMaterial({
    vertexShader: document.getElementById("vertexShader").textContent,
    fragmentShader: document.getElementById("fragmentShader").textContent
})
const sphere2 = new three.Mesh(sphere2Geometry, sphere2Material)
scene.add(sphere2)
sphere2.position.set(-5, 10, 10)

const assetLoader = new GLTFLoader()

assetLoader.load(monkeyUrl.href, gltf => {
    const model = gltf.scene
    scene.add(model)
    model.position.set(-12, 4, 10)
}, undefined, error => console.error(error))

const gui = new dat.GUI({ autoPlace: true })

const options = {
    sphereColor: "#ffea00",
    wireframe: false,
    speed: 0.01,
    angle: 0.2,
    penumbra: 0,
    intensity: 50000
}

gui.addColor(options, "sphereColor").onChange(value => {
    sphere.material.color.set(value)
})

gui.add(options, "wireframe").onChange(value => {
    sphere.material.wireframe = value
})

gui.add(options, "speed", 0, 0.1)

gui.add(options, "angle", 0, 1)
gui.add(options, "penumbra", 0, 1)
gui.add(options, "intensity", 10000, 500000)

let step = 0

const mousePosition = new three.Vector2()

window.addEventListener("mousemove", e => {
    mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = (e.clientY / window.innerHeight) * 2 + 1
})

const rayCaster = new three.Raycaster()

const sphereId = sphere.id

function animate() {
    box.rotation.x += 0.01
    box.rotation.y += 0.01

    step += options.speed
    sphere.position.y = 10 * Math.abs(Math.sin(step))

    spotLight.angle = options.angle
    spotLight.penumbra = options.penumbra
    spotLight.intensity = options.intensity
    spotLightHelper.update()

    rayCaster.setFromCamera(mousePosition, camera)

    const intersects = rayCaster.intersectObjects(scene.children)

    for (const intersectedElement of intersects) {
        if (intersectedElement.object.id === sphereId) {
            intersectedElement.object.material.color.set(0xFF0000)
        }
    }

    plane2.geometry.attributes.position.array[0] -= 10 * Math.random()
    plane2.geometry.attributes.position.array[1] -= 10 * Math.random()
    plane2.geometry.attributes.position.array[2] -= 10 * Math.random()
    plane2.geometry.attributes.position.array[lastPointZ] -= 10 * Math.random()
    plane2.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
}

renderer.setAnimationLoop(animate)

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

