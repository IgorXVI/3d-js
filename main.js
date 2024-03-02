import "./style.css"

import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap"

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

const light = new THREE.PointLight(0xffffff, 200, 100)
light.position.set(0, 10, 10)
scene.add(light)

const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({ color: "#00ff83", roughness: 0.2 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


const canvas = document.querySelector(".webgl")

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true
controls.autoRotateSpeed = 5

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

window.addEventListener("resize", () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height

    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
})

function renderLoop() {
    controls.update()

    renderer.render(scene, camera)
    window.requestAnimationFrame(renderLoop)
}
renderLoop()

const tl = gsap.timeline({ defaults: { duration: 1 } })
tl.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
tl.fromTo("nav", { y: "-100%" }, { y: "0%" })
tl.fromTo(".title", { opacity: 0 }, { opacity: 1 })

let mouseDown = false
let rgb = {
    r: 0,
    g: 255,
    b: 0
}
window.addEventListener("mousedown", () => {
    mouseDown = true
})
window.addEventListener("mouseup", () => {
    mouseDown = false
})
window.addEventListener("mousemove", e => {
    if (mouseDown) {
        rgb = {
            r: Math.round(e.pageX / sizes.width) * 255,
            g: Math.round(e.pageY / sizes.height) * 255,
            b: 150
        }
        const newColor = new THREE.Color(`rgb(${Object.values(rgb).join(",")})`)
        gsap.to(mesh.material.color, newColor)
    }
})