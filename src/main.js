import "./style.css";
import *as THREE from "three";
import {
    AmbientLight,
    BoxGeometry,
    DirectionalLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";
import World from './world';
import Glider from './moving';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as dat from 'dat.gui'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const gui = new dat.GUI()
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {

    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})

//textures
var textureLoader = new THREE.TextureLoader();
var texture444 = textureLoader.load('/src/download.jfif');
var texture44 = textureLoader.load('/src/download (1).jfif');
var texture45 = textureLoader.load('/src/OIP.jfif');
const cubetexture = new THREE.CubeTextureLoader()

const Cloud = new THREE.Group()
const scene = new THREE.Scene()
/*const mapenvironment=cubetexture.load([

    '/static/textures/environmentMaps/1/px.jpg',
    '/static/textures/environmentMaps/1/nx.jpg',
    '/static/textures/environmentMaps/1/py.jpg',
    '/static/textures/environmentMaps/1/ny.jpg',
    '/static/textures/environmentMaps/1/pz.jpg',
    '/static/textures/environmentMaps/1/nz.jpg'
    
])
console.log(mapenvironment)
scene.background=mapenvironment*/

//material for sky box
let materialsArray = []
let texture1 = new THREE.TextureLoader().load('/static/textures/environmentMaps/1/px.jpg',)
let texture2 = new THREE.TextureLoader().load('/static/textures/environmentMaps/1/nx.jpg',)
let texture3 = new THREE.TextureLoader().load('/static/textures/environmentMaps/1/py.jpg',)
let texture4 = new THREE.TextureLoader().load('/static/textures/environmentMaps/1/ny.jpg',)
let texture5 = new THREE.TextureLoader().load('/static/textures/environmentMaps/1/pz.jpg',)
let texture6 = new THREE.TextureLoader().load('/static/textures/environmentMaps/1/nz.jpg')
materialsArray.push(new THREE.MeshBasicMaterial({ map: texture1 }))
materialsArray.push(new THREE.MeshBasicMaterial({ map: texture2 }))
materialsArray.push(new THREE.MeshBasicMaterial({ map: texture3 }))
materialsArray.push(new THREE.MeshBasicMaterial({ map: texture4 }))
materialsArray.push(new THREE.MeshBasicMaterial({ map: texture5 }))
materialsArray.push(new THREE.MeshBasicMaterial({ map: texture6 }))
for (let i = 0; i < 6; i++)
    materialsArray[i].side = THREE.BackSide
let boxgeometry = new THREE.BoxGeometry(30_000, 30_000, 30_000)
let meshsky = new THREE.Mesh(boxgeometry, materialsArray)
meshsky.position.set(7_000, 3_000, 0)
scene.add(meshsky)
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3, 1, 4)
    , new THREE.MeshBasicMaterial({ color: 'blue' }))
roof.position.y = 3
roof.rotation.y = Math.PI / 4

//Ground
const groundgeometry = new THREE.PlaneGeometry(40_000, 40_000)
const material = new THREE.MeshBasicMaterial({ map: texture45 });
texture45.repeat.x = 50
texture45.repeat.y = 50
texture45.wrapS = THREE.RepeatWrapping
texture45.wrapT = THREE.RepeatWrapping
const ground = new THREE.Mesh(groundgeometry, material);
ground.position.set(0, 0, 0)
scene.add(ground)

//fog 
const near = 100;
const far =25_000;
const fogColor = new THREE.Color(0xffffff);
scene.fog = new THREE.Fog(fogColor, near, far);

// let mixer=null
// const fox=new GLTFLoader()
// fox.load(
//     '/static/models/Fox/glTF/Fox.gltf'
//     , (gltf)=>{
//          mixer=new THREE.AnimationMixer(gltf.scene)
//        const action=mixer.clipAction(gltf.animations[2])
//        action.play()
//         gltf.scene.position.y=4
//         gltf.scene.scale.set(0.025,0.025,0.025)
//         pla.add(gltf.scene)
//     }
// )

//mountain
const hill = new GLTFLoader()
hill.load(
    '/static/models/druid_hills/scene.gltf'
    , (gltf) => {
        //
        //gltf.scene.rotation.y=Math.PI
        gltf.scene.position.set(-2015, -1000, 155)
        gltf.scene.scale.set(1, 1, 1)
    
        scene.add(gltf.scene)
    }
)
//light
const color = 0xFFFFFF;
const intensity =3.5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

//cloud
const cloud = new GLTFLoader()
cloud.load(
    '/static/models/cloud_ring/scene.gltf'
    , (gltf) => {
        //gltf.scene.rotation.y=Math.PI
        gltf.scene.position.set(0,0,0)
        gltf.scene.scale.set(1000, 1000, 1000)
        scene.add(gltf.scene)
    }
)
//cloud2
const cloud2 = new GLTFLoader()
cloud2.load(
    '/static/models/cloud/scene.gltf'
    , (gltf) => {
        //
        //gltf.scene.rotation.y=Math.PI
        gltf.scene.position.set(0,3000,0)
        gltf.scene.scale.set(2000, 2000, 2000)
    
      scene.add( gltf.scene)
    }
)

ground.position.y = 0
ground.rotation.x = -Math.PI * 0.5
const Stand = new THREE.Group()
const Plane = new THREE.Group()
const plane = new GLTFLoader()

let AOA = 5 * (Math.PI / 180)

//////under_the_plane
// const under_the_plane = new THREE.BoxGeometry(2, 28, 0.8)
const under_the_plane = new THREE.BoxGeometry(8, 0.5, 40)
const material3 = new THREE.MeshBasicMaterial({ map: texture444 });
const mesh1 = new THREE.Mesh(under_the_plane, material3);
mesh1.position.y = 3
mesh1.position.x = 3
mesh1.position.z = 7
mesh1.rotation.x = AOA
//control gui
// gui.add(mesh1.position, 'y', 0, 5, 0.0001)
// gui.add(mesh1.rotation, 'x', -2, 0, 0.0001)

let mass = 100;
let S = 70; // S
let windSpeed = 20

// Glider(glider, mass, S, AOA, box, skybox, windSpeed)
var glider = new Glider(Plane, mass, S, AOA, mesh1, meshsky, windSpeed);
// glider.mesh.rotation.x = AOA 

gui.add(glider, 'mass', 100, 1000, 10);
gui.add(glider, 'S', 0, 100, 2);
gui.add(glider, 'windSpeed', 0, 50, 1);

plane.load(
    '/static/models/ask_21_mi/scene.gltf'
    , (gltf) => {
        gltf.scene.position.x = 1
        // gltf.scene.position.z=-2
        gltf.scene.position.y = 3
        gltf.scene.rotation.y = Math.PI * 0.5
        gltf.scene.scale.set(1, 1, 1)
        Plane.add(gltf.scene)
    }
)
//wheel
const wagon_wheel = new GLTFLoader()
wagon_wheel.load(
    '/static/models/wagon_wheel/scene.gltf'
    , (gltf) => {
        gltf.scene.position.y = 2
        gltf.scene.rotation.y = Math.PI * 0.5
        gltf.scene.scale.set(0.215, 0.215, 0.215)
        Stand.add(gltf.scene)
    }
)

//walls
const material1 = new THREE.MeshBasicMaterial({ map: texture44 })
//material1.side = THREE.BackSide;

const walls = new THREE.Mesh(
    new THREE.BoxGeometry(0.2,20, 0.2)
    , material1
)
walls.position.y = -5
walls.position.x =0
const material2 = new THREE.MeshBasicMaterial({ map: texture44 })
const walls2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 20, 0.2)
    , material2
)

walls2.position.y = -5
walls2.position.x =0
Stand.add(walls)
Stand.add(walls2)


Stand.add(mesh1)
Stand.add(Plane)
Stand.position.y = 997.5
Stand.position.x = 100
Stand.position.z = -100
Stand.scale.set(2,2,2)
Stand.rotation.y=Math.PI*0.5
scene.add(Stand)
let xxx=1003
Plane.position.y = xxx
Plane.position.x = 125
Plane.position.z = -100
Plane.rotation.y=Math.PI*0.5
Plane.scale.set(1.2,1.2,1.2)
scene.add(Plane)


//axeshelper
const axeshelper = new THREE.AxesHelper(1)
scene.add(axeshelper)
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    // console.log("kodkd")
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

})
//camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000000)

//camera.position.z = 3
var isSpaceKeyPressed = false;
var shouldGliderMove = false;
var result = null;

function onKeyDown(event) {
  if (event.keyCode === 32) {
    isSpaceKeyPressed = true;
  }
}

function onKeyUp(event) {
  if (event.keyCode === 32) {
    isSpaceKeyPressed = false;
    shouldGliderMove = true;
  }
}

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);
scene.add(camera)

//camera.lookAt(mesh.position)
//console.log(mesh.position.length())
//console.log(meshs.position.distanceTo(camera.position))
//mesh.position.normalize()
const canvas = document.querySelector('.webgl')

/////////controls
//const controls = new OrbitControls(camera, canvas)
//controls.enableDamping = true

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
const clock = new THREE.Clock()
let previous = 0
let draw;

const tick = () => {

   // camera.lookAt(new THREE.Vector3(100, 111, 111))
    window.requestAnimationFrame(tick)
    const deltaTime = clock.getDelta();
    const result = glider.execute(deltaTime);
    Plane.position.copy(result.position);
    //console.log("position in gui", meshs.position)

    renderer.physicallyCorrectLights = true

    renderer.render(scene, camera)


}


function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
  
 /////////مكابح
  if (shouldGliderMove || (result && !result.done)) {
    result = glider.execute(deltaTime);
    Plane.position.copy(result.position);
    shouldGliderMove = result.done ? false : shouldGliderMove || isSpaceKeyPressed;
  } 
//    console.log("position in gui", Plane.position)
      camera.position.z= 2
   
    // controls.update()

//    camera.position.add(direction.multiplyScalar(3));
//     camera.lookAt(pla.position);
// Define the distance to offset the camera along the x-axis
const offsetX =0;

// Create a new position vector for the camera
const newPosition = new THREE.Vector3(Plane.position.x + offsetX, Plane.position.y + 8, Plane.position.z + 15);

camera.position.copy(newPosition);
camera.lookAt(Plane.position);
renderer.physicallyCorrectLights = true

    renderer.render(scene, camera);
}

animate();