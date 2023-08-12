import * as THREE from 'three'
import World from './world'

// Wind
const WindMatrix = wind();
function wind() {
  let N = 10, height = 0, Matrix = [];

  for(let i = 0 ; i < N ; i++){    
      let windCurrent = {
          minHeight : height,
          maxHeight : height + Math.ceil (Math.random() * 10000), 
          windSpeed : Math.ceil (Math.random() * 500),
          Xangle :  Math.random() * 2 * Math.PI,
          Yangle :  Math.random() * 2 * Math.PI,
          Zangle :  Math.random() * 2 * Math.PI,
      }
      height = windCurrent.maxHeight;
      Matrix.push(windCurrent);
  }
  return Matrix;
}

// Glider class
class Glider{
  constructor(glider, mass, S, AOA, box, skybox, windSpeed) { 
    // inputs
    this.mesh = glider
    this.mass = mass
    this.S = S
    this.AOA = AOA
    this.box = box
    this.skybox = skybox
    this.windSpeed = windSpeed
    // Coefficient 
    this.CL =  62
    this.CD = 1.6 
    // world
    this.world = new World()

    // Initialize the velocityand netForce vectors 
    this.vel = new THREE.Vector3()
    this.netF = new THREE.Vector3()
  }

  collision(){
    // Check for collision on the ground
    if(this.mesh.position.y <= 0){
      this.vel.setY(0)
      let Fn =  this.w.length()
      let n = new THREE.Vector3(0, Fn, 0)
      this.applyForce(n)
      // console.log("ground n: ", n)
    }

    // Check for collision with box
    const boxBounds = new THREE.Box3().setFromObject(this.box)
    const gliderBounds = new THREE.Sphere(this.mesh.position, 1)
    if (boxBounds.intersectsSphere(gliderBounds)) {
        this.vel.setY(0)
        let Fn =  this.w.length()
        let n = new THREE.Vector3(Fn * Math.cos(this.AOA), Fn * Math.sin(this.AOA), 0)
        this.applyForce(n)
        // console.log("box n: ", n)
        this.boxFriction()
    }

  }

  skyboxCollision() {
    const skyboxCenter = this.skybox.position.clone();
    const skyboxSize = this.skybox.scale.x * 15000; // assuming uniform scaling
    const gliderPos = this.mesh.position.clone();
    const distance = gliderPos.distanceTo(skyboxCenter);
    const threshold = skyboxSize - 1000; // adjust as needed

    if (distance > threshold) {
        const boxBounds = new THREE.Box3().setFromObject(this.skybox);
        const gliderBounds = new THREE.Sphere(gliderPos, 1);
        return boxBounds.intersectsSphere(gliderBounds)
    }
    return false
}

  groundFriction(){
    // constant
    let mu = 100, normal = this.mass * 0.7 

    // fricrion magnitude
    let fric = mu * normal 
    let fricV = new THREE.Vector3(-fric, 0, 0)
   
    // apply when it hit the ground
    if(this.mesh.position.y <= 0 && this.vel.x > 0){
      // this.vel.x *= 0.1
      this.applyForce(fricV)
      console.log("ground friction:", fricV)
    }         
    if(this.mesh.position.y <= 0 && this.vel.x <= 0)  this.vel.x = 0

  }

  boxFriction(){
    // constant
    let mu = 3, normal = this.mass * 0.7

    // fricrion magnitude
    let fric = mu * normal 
    let fricV = new THREE.Vector3(-fric * Math.cos(this.AOA), fric * Math.sin(this.AOA), 0)
   
    this.applyForce(fricV)
    // console.log("box friction:", fricV)
  }

  calc_q(speed){
    // q = 1/2.rho.v^2
    let rho = this.world.calc_air_rho(this.mesh.position.y)
    let q = 0.5 * rho * Math.sqrt(speed)
    return q
  }

  applyForce(force){       
    this.netF.add(force)
  }    

  update(deltaTime){       
      // a = F/m
      this.acc = this.netF.clone().divideScalar(this.mass)

      // Update the velocity based on the acceleration [v = v + (a*dt)]
      this.vel.add(this.acc.clone().multiplyScalar(deltaTime))
      // round to two digit after decimial point
      this.vel.x = Number(this.vel.x.toFixed(2))
      this.vel.y = Number(this.vel.y.toFixed(2))
      this.vel.z = Number(this.vel.z.toFixed(2))

      // Update the position based on the velocity [r = r + (v*dt)]
      this.mesh.position.add(this.vel.clone().multiplyScalar(deltaTime))          
  }

  weight(){
    // gravity vector on the glider
    let g = new THREE.Vector3(0, - this.world.calc_gravity(this.mesh.position.y), 0)
    // W = m.g   
    this.w = g.clone().multiplyScalar(this.mass)
    this.applyForce(this.w)
  }

  lift(){
    // constant
    let q = this.calc_q(this.windSpeed)

    // lift magnitude
    let lift = this.CL * q * this.S 
    this.l = new THREE.Vector3(lift * Math.cos(this.AOA), lift * Math.sin(this.AOA), 0)
     
    this.applyForce(this.l)
  }

  drag(){
    // constant
    let speed = this.vel.length()
    let q = this.calc_q(speed)

    // lift magnitude
    let drag = this.CD * q * this.S 
    this.d = new THREE.Vector3(- drag * Math.cos(this.AOA), drag * Math.sin(this.AOA), 0)
     
    this.applyForce(this.d)
  }

  execute(deltaTime) {
    this.netF.set(0,0,0)

    // Check if in the skybox
    if(!this.skyboxCollision()){
      this.weight()
      this.collision()
      this.groundFriction()
      this.lift()
      this.drag()  

      // This could be input wind
      // let i = new THREE.Vector3(200,-200,200)
      // this.applyForce(i)
      
     
      this.update(deltaTime)
    
      // print
      // console.log("weight: ", this.w)
      // console.log("lift: ", this.l.length())
      // console.log("drag: ", this.d)
      console.log("velocity: ", this.vel)
      // console.log("position: ", this.mesh.position)
      // console.log("box position: ", this.box.position )
    }
    // Edge of skybox
    else{
      this.vel.set(0,0,0)      
    }
       

    return {
      position: this.mesh.position
    };
   
  };
}
export default Glider;