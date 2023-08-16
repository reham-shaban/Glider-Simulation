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
var texture45 = textureLoader.load('/src/download (1).jpg');
const cubetexture = new THREE.CubeTextureLoader()

const Cloud = new THREE.Group()
const scene = new THREE.Scene()
const mapenvironment=cubetexture.load([
    '/static/textures/environmentMaps/1/px.jpg',
    '/static/textures/environmentMaps/1/nx.jpg',
    '/static/textures/environmentMaps/1/py.jpg',
    '/static/textures/environmentMaps/1/ny.jpg',
    '/static/textures/environmentMaps/1/pz.jpg',
    '/static/textures/environmentMaps/1/nz.jpg'
    
])
console.log(mapenvironment)
scene.background=mapenvironment
//Ground
const groundgeometry = new THREE.PlaneGeometry(50_000, 50_000)
const material = new THREE.MeshBasicMaterial({ map: texture45 });
texture45.repeat.x = 50
texture45.repeat.y = 50
texture45.wrapS = THREE.RepeatWrapping
texture45.wrapT = THREE.RepeatWrapping
const ground = new THREE.Mesh(groundgeometry, material);
ground.position.set(0, 0, 0)
scene.add(ground)
const near = 100;
const far = 25_000;
const fogColor = new THREE.Color(0xffffff);
const fogDensity = 0.000035; // تعديل كثافة الضباب

scene.fog = new THREE.FogExp2(fogColor, fogDensity);
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
const intensity =1.5;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);

//cloud/*
const cloud = new GLTFLoader()
cloud.load(
    '/static/models/cloud_ring/scene.gltf'
    , (gltf) => {
 
        //gltf.scene.rotation.y=Math.PI
        gltf.scene.position.set(-9000,0,4000)
        gltf.scene.scale.set(2000, 2000, 2000)
        scene.add(gltf.scene)
    }
)
//mill windconst house = new GLTFLoader();
const modelss = [];
const house = new GLTFLoader();
house.load('/static/models/mill-wind/scene.gltf', (gltf) => {
    for (let i = 0; i < 4; i++) {
        const model = gltf.scene.clone();
        model.position.x = 5000 + i * 5000; // Set the X position with an initial offset of 5000 and distance of 1000 units between each model
        model.position.y = 2500; // Set the desired Y position
        model.position.z = -10000; // Set the desired Z position
        model.scale.set(300, 300, 300); // Set the desired scale
        scene.add(model);
        modelss.push(model);
    }
});

/////////////////////////road
const road = new GLTFLoader();
road.load('/static/models/road_straight/scene.gltf', (gltf) => {
    gltf.scene.rotation.y = Math.PI / 2;
    gltf.scene.position.set(17000, 0, 0);
    gltf.scene.scale.set(70, 100,70);
    scene.add(gltf.scene);
});
//////////////////////////////
let mixer = null;
const models = [];
const tahona = new GLTFLoader();
tahona.load('/static/models/wind/scene.gltf', (gltf) => {
    const animations = gltf.animations;

    for (let i = 0; i < 10; i++) {
        const model = gltf.scene.clone();
        model.position.x = 7000+i * 2000; // Set the X position with a distance of 100 units
        model.position.y = 2000; // Set the desired Y position
        model.position.z = -4000; // Set the desired Z position
        model.rotation.y = -Math.PI/2;
        model.scale.set(30, 30, 30); // Set the desired scale
        scene.add(model);

        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(animations[0]);
        action.play();
        mixer.timeScale = 10.0; // Increase the animation speed
        models.push({ model, mixer, action });
    }
  
});
const tahona2 = new GLTFLoader();
tahona2.load('/static/models/wind/scene.gltf', (gltf) => {
    const animations = gltf.animations;

    for (let i = 0; i < 10; i++) {
        const model = gltf.scene.clone();
        model.position.x = 7000+i * 2000; // Set the X position with a distance of 100 units
        model.position.y = 2000; // Set the desired Y position
        model.position.z = 4000; // Set the desired Z position
        model.rotation.y = Math.PI/2;
        model.scale.set(30, 30, 30); // Set the desired scale
        scene.add(model);

        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(animations[0]);
        action.play();
        mixer.timeScale = 10.0; // Increase the animation speed
        models.push({ model, mixer, action });
    }

  
});
const tree = new GLTFLoader();
const numTrees =70
tree.load(
    '/static/models/low_poly_trees_free/scene.gltf',
    (gltf) => {
        const startX = 5000;
        const endX = 20000;
        const startZ = -600;
        const endZ = -3000;

        const incrementX = (endX - startX) / (Math.sqrt(numTrees) - 1);
        const incrementZ = (endZ - startZ) / (Math.sqrt(numTrees) - 1);

        for (let i = 0; i < Math.sqrt(numTrees); i++) {
            const x = startX + incrementX * i;
            const z = startZ + incrementZ * i;

            const treeModel = gltf.scene.clone();
            treeModel.position.set(x, 0, z);
            treeModel.scale.set(600, 600, 600);
            scene.add(treeModel);

            for (let j = 1; j < Math.sqrt(numTrees); j++) {
                const treeModel = gltf.scene.clone();
                treeModel.position.set(x, 0, z + incrementZ * j);
                treeModel.scale.set(600, 600, 600);
                scene.add(treeModel);
            }
        }
    }
);
const tree2 = new GLTFLoader();
const numTrees2 =100
tree.load(
    '/static/models/low_poly_trees_free/scene.gltf',
    (gltf) => {
        const startX = 2000;
        const endX = 20000;
        const startZ = 600;
        const endZ = 3000;

        const incrementX = (endX - startX) / (Math.sqrt(numTrees2) - 1);
        const incrementZ = (endZ - startZ) / (Math.sqrt(numTrees2) - 1);

        for (let i = 0; i < Math.sqrt(numTrees); i++) {
            const x = startX + incrementX * i;
            const z = startZ + incrementZ * i;

            const treeModel = gltf.scene.clone();
            treeModel.position.set(x, 0, z);
            treeModel.scale.set(600, 600, 600);
            scene.add(treeModel);

            for (let j = 1; j < Math.sqrt(numTrees); j++) {
                const treeModel = gltf.scene.clone();
                treeModel.position.set(x, 0, z + incrementZ * j);
                treeModel.scale.set(600, 600, 600);
                scene.add(treeModel);
            }
        }
    }
);
//cloud2
const cloud2 = new GLTFLoader()
cloud2.load(
    '/static/models/cloud/scene.gltf'
    , (gltf) => {
        //
        //gltf.scene.rotation.y=Math.PI
        gltf.scene.position.set(0,4000,0)
        gltf.scene.scale.set(2000, 2000, 2000)
    
      scene.add( gltf.scene)
    }
)

ground.position.y = -10
ground.rotation.x = -Math.PI * 0.5
const Stand = new THREE.Group()
const Plane = new THREE.Group()
const plane = new GLTFLoader()

let AOA = 5 * (Math.PI / 180)

//////under_the_plane
// const under_the_plane = new THREE.BoxGeometry(2, 28, 0.8)
const under_the_plane = new THREE.BoxGeometry(8, 0.5, 60)
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
var v, cl, aoa
// Glider(glider, mass, S, AOA, box, skybox, windSpeed)
var glider = new Glider(Plane, mass, S, AOA, mesh1, mapenvironment, windSpeed);
// glider.mesh.rotation.x = AOA 

gui.add(glider, 'mass', 100, 1000, 10);
gui.add(glider, 'S', 0, 100, 2);
gui.add(glider, 'windSpeed', 0, 100, 1);
aoa=gui.add(glider, 'AOA', -0.5, 0.5, 0.01);
v=gui.add(glider,'v');
cl=gui.add(glider, 'CL');

plane.load(
  '/static/models/ask_21_mi/scene.gltf'
  , (gltf) => {
     
      gltf.scene.position.x = 1
      // gltf.scene.position.z=-2
      gltf.scene.position.y = 3

     // gltf.scene.rotation.z = Math.PI * 0.1
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


const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  secondCamera.aspect = sizes.width / sizes.height;
  secondCamera.updateProjectionMatrix();
  thirdCamera.aspect = sizes.width / sizes.height;
  thirdCamera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000000);
camera.position.z = 3;

const secondCamera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 1000000);
secondCamera.position.y = 100;

const thirdCamera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000000);
thirdCamera.position.set(0, 1000, 0);

let currentCamera = camera;

var isSpaceKeyPressed = false;
var shouldGliderMove = false;
var result = null;

function onKeyDown(event) {
  if (event.keyCode === 32) {
    isSpaceKeyPressed = true;
  } else if (event.keyCode === 13) { // رمز الزر Enter
    // التبديل بين الكاميرتين
    currentCamera = currentCamera === camera ? secondCamera : camera;
    currentCamera.position.copy(camera.position);
    currentCamera.lookAt(camera.getWorldDirection(new THREE.Vector3()).add(camera.position));
  } else if (event.keyCode === 79) { // رمز الزر O
    currentCamera = thirdCamera;
    currentCamera.position.copy(Plane.position);
    currentCamera.lookAt(Plane.position.clone().add(Plane.getWorldDirection(new THREE.Vector3())));
  }
}

function onKeyUp(event) {
  if (event.keyCode === 32) {
    isSpaceKeyPressed = false;
    shouldGliderMove = true;
  } else if (event.keyCode === 79) { 
    
    currentCamera = camera;
    currentCamera.position.copy(camera.position);
    currentCamera.lookAt(camera.getWorldDirection(new THREE.Vector3()).add(camera.position));
  }
  
}

document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

scene.add(camera);

var listener = new THREE.AudioListener();
camera.add(listener);
var sound = new THREE.Audio(listener);
var audioLoader = new THREE.AudioLoader();
function playSound() {
  audioLoader.load('./assets/land.MP3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1);
    sound.play();
  });
}
function playSound3() {
  audioLoader.load('./assets/windd.mp3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1);
    sound.play();
  });
}
function playSound2() {
  audioLoader.load('./assets/takeoff.MP3', function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(1);
    sound.play();
  });
}
function playSound4(){
  var vvvv=1
}
const canvas = document.querySelector('.webgl');

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);

const clock = new THREE.Clock();


const tick = () => {
  window.requestAnimationFrame(tick);
  const deltaTime = clock.getDelta();
  Plane.rotation.y= Math.PI
  let isSoundPlayed = false;
  if (shouldGliderMove || (result && !result.done)) {
     Plane.rotation.z=Math.PI*0.1
    
   // Plane.rotation.x= Math.PI*0.5 
    

    result = glider.execute(deltaTime);
    
    Plane.position.copy(result.position);
    var planePosition = Plane.position.y;
    shouldGliderMove = result.done ? false : shouldGliderMove || isSpaceKeyPressed;
    // console.log("hhhhhhhhhhhhh",planePosition)
   if(planePosition>=1003.0003330000001&&planePosition<1003.1){
      playSound2()
    }
    else if (planePosition>1003.1||(planePosition<1003.0003330000001&&planePosition>300)){
      playSound3()
    }
    else if(planePosition<600&&planePosition>1){
      playSound()
    }
    else{
      playSound4
    }
  }
  const offsetX = 0;
  const newPosition = new THREE.Vector3(Plane.position.x + offsetX, Plane.position.y + 8, Plane.position.z + 15);
  currentCamera.position.copy(newPosition);
  const delta = clock.getDelta();

  models.forEach(({ mixer }) => {
      if (mixer) {
        aoa.updateDisplay();
        v.updateDisplay();
        cl.updateDisplay();
        mixer.update(delta);
      }
  });
  renderer.render(scene, currentCamera);
};

tick();
