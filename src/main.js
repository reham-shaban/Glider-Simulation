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


//import watervertex from './shaders/water/vertex.glsl'
//import waterfrag from './shaders/water/fragment.glsl'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as dat from 'dat.gui'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

//console.log(watervertex)
const gui = new dat.GUI()
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (event) => {

    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = -(event.clientY / sizes.height - 0.5)
})


///////

var textureLoader = new THREE.TextureLoader();
var texture444 = textureLoader.load('/src/download.jfif');
var texture44 = textureLoader.load('/src/download (1).jfif');
var texture45 = textureLoader.load('/src/OIP.jfif');

///////
const cubetexture = new THREE.CubeTextureLoader()
const group = new THREE.Group()
console.log(THREE.GLTFLoader)
///////////////////
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

let boxgeometry = new THREE.BoxGeometry(20000, 20000, 20000)
let meshsky = new THREE.Mesh(boxgeometry, materialsArray)
meshsky.position.set(7000, 3000, 0)
scene.add(meshsky)
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3, 1, 4)
    , new THREE.MeshBasicMaterial({ color: 'blue' }))
let boxg = new THREE.BoxGeometry(1, 1, 1)

let meshs = new THREE.Mesh(boxg, materialsArray)
meshs.position.set(0, 0, 0)
scene.add(meshs)
roof.position.y = 3
roof.rotation.y = Math.PI / 4
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2)
    , new THREE.MeshBasicMaterial({ color: 'blue' }))
door.position.z = 2.0001
door.position.y = 1
const plane = new THREE.PlaneGeometry(40000, 40000)
const material = new THREE.MeshBasicMaterial({ map: texture45 });
texture45.repeat.x = 50
texture45.repeat.y = 50
texture45.wrapS = THREE.RepeatWrapping
texture45.wrapT = THREE.RepeatWrapping
const mesh = new THREE.Mesh(plane, material);
mesh.position.set(0, 0, 0)
scene.add(mesh)

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

const color = 0xFFFFFF;
const intensity =3.5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);



mesh.position.y = 0
mesh.rotation.x = -Math.PI * 0.5
const pla = new THREE.Group()
const plaa = new THREE.Group()

const gLTFLoader = new GLTFLoader()
var variable=100;
var variable2=1000;
// reham added
let S = 70;
let windSpeed = 1;
let V0 = new THREE.Vector3(20,0,0);

// Glider(glider, mass, height, S, windSpeed, V0)
var glider = new Glider(plaa, variable, variable2, S, windSpeed, V0);

gui.add(glider, 'mass', 100, 1000,10);
gui.add(glider, 'height', 1000, 1000000,1000);


gLTFLoader.load(
    '/static/models/ask_21_mi/scene.gltf'
    , (gltf) => {
        gltf.scene.position.x = 1
        // gltf.scene.position.z=-2
        gltf.scene.position.y = 3.5
        gltf.scene.rotation.y = Math.PI * 0.5
        gltf.scene.scale.set(1, 1, 1)
        plaa.add(gltf.scene)
    }
)

const gL = new GLTFLoader()
gL.load(
    '/static/models/wagon_wheel/scene.gltf'
    , (gltf) => {
        gltf.scene.position.y = 2
        gltf.scene.rotation.y = Math.PI * 0.5
        gltf.scene.scale.set(0.125, 0.125, 0.125)
        pla.add(gltf.scene)
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
//house.add(door)
//house.add(roof)
//house.add(walls)
pla.add(walls)
pla.add(walls2)

const plane1 = new THREE.BoxGeometry(2, 28, 0.8)
const material3 = new THREE.MeshBasicMaterial({ map: texture444 });

const mesh1 = new THREE.Mesh(plane1, material3);
mesh1.position.y = 3
mesh1.position.x = 1

mesh1.position.z = 7
mesh1.rotation.x = Math.PI * 0.5
gui.add(mesh1.position, 'y', 0, 2, 0.0001)
gui.add(mesh1.rotation, 'x', -2, 0, 0.0001)
pla.add(mesh1)
pla.add(plaa)
pla.position.y = 997.5
pla.position.x = 100
pla.position.z = -100
pla.scale.set(2,2,2)
pla.rotation.y=Math.PI*0.5
scene.add(pla)
plaa.position.y = 1003
plaa.position.x = 125
plaa.position.z = -100
plaa.rotation.y=Math.PI*0.5
plaa.scale.set(1.2,1.2,1.2)
scene.add(plaa)





//scale
//mesh.scale.x=2
//mesh.scale.z=0.5
//mesh.scale.y=0.5
//rotation
//mesh.rotation.reorder("YXZ")
//mesh.rotation.y=Math.PI*0.2
//.rotation.x=Math.PI*0.2
const axeshelper = new THREE.AxesHelper(1)
scene.add(axeshelper)
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
    console.log("kodkd")
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)

})
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
console.log(meshs.position.distanceTo(camera.position))
//mesh.position.normalize()

/////////////////////////////////////////////sea

/*const watergeo=new THREE.PlaneGeometry(2,2,128,128)
 const watermaterial=new THREE.ShaderMaterial(
    {
        vertexShader:watervertex,
        fragmentShader:waterfrag
    }
 )
 const water=new THREE.Mesh(watergeo,watermaterial)
 water.rotation.x=-Math.PI/2
scene.add(water)*/
////////////////////////////////////////////



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
    plaa.position.copy(result.position);
    console.log("Position", meshs.position)
  //controls.update()
    renderer.physicallyCorrectLights = true

    renderer.render(scene, camera)


}






function animate() {
    requestAnimationFrame(animate);
    const deltaTime = clock.getDelta();
  
    
  if (shouldGliderMove || (result && !result.done)) {   
    result = glider.execute(deltaTime);
    plaa.position.copy(result.position);
    shouldGliderMove = result.done ? false : shouldGliderMove || isSpaceKeyPressed;
  }
//    console.log("asdfghjklasdfghjklasdfghjklsdfghjkl", plaa.position)
     //camera.position.y =pla.position.y
     // camera.position.z =pla.position.z
     // camera.position.x =pla.position.x
     //const direction = new THREE.Vector3();
     //direction.subVectors(pla.position, camera.position);
   
//    // Normalize the vector to a unit length
//    direction.normalize();
   
//    // Move the camera closer to the mesh along the direction vector
//    camera.position.add(direction.multiplyScalar(3));
//     camera.lookAt(pla.position);
// Define the distance to offset the camera along the x-axis
const offsetX =0;

// Create a new position vector for the camera
const newPosition = new THREE.Vector3(plaa.position.x + offsetX, plaa.position.y, plaa.position.z + 20);

camera.position.copy(newPosition);
camera.lookAt(plaa.position);
renderer.physicallyCorrectLights = true

    renderer.render(scene, camera);
}

animate();