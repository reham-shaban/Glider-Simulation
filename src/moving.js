import * as THREE from 'three';
import World from './world';

let alpha = 5 * (Math.PI/180),  // (attack angel): from the rotation of x,z around y
    phi   = 0 * (Math.PI/180),  // (roll angel): rotation around x
    theta = 5 * (Math.PI/180),  // (pitch angel): rotation around y
    psi   = 0 * (Math.PI/180);  // (yaw angel): rotation around z
    // this.orientation = new THREE.Vector3(phi, theta, psi, 'XYZ');

// Glider class
class Glider{
  constructor(glider, mass, height) { 
    this.mass = mass;
    this.S = 70;
    // Coefficient 
    this.CL =  62;//final
    this.CD = 1.6;//final
    
    this.mesh = glider;

    // world
    this.height = height;
    this.world = new World();

    // Initialize the velocity and acceleration vectors to zero
    this.vel = new THREE.Vector3(1,0,0);
    this.acc = new THREE.Vector3(); 
    this.F = new THREE.Vector3()
  }

  edges(){
    // check if ball is below ground level
    if (this.mesh.position.y <= 0) {
        this.mesh.position.setY(0);
              
        if(this.vel.x < 5)  this.vel.x = 0;
        else  this.vel.multiplyScalar(0.5);
         
    }
  }

  calc_q(){
    // q = 1/2.rho.v^2
    let rho =0.9* this.world.calc_air_rho(this.height);
    let speed = this.vel.length();
   let q = 0.5 * rho * Math.sqrt(speed);
    return q;
  }
 
  // applyForce(force){
  //   // [a += F/m]
  //   let a = force.clone().divideScalar(this.mass)
  //   this.acc.add(a);  
  // };
  

  updateAngles(){      
    // angel of attack
    if(this.AOA <= 0.8)
      this.AOA += 0.001;
    // rotate the glider
    this.mesh.rotation.x = this.AOA;
  }

  weight(g){
    // W = m.g   
    let W = g.clone().multiplyScalar(this.mass);
    
    // this.applyForce(W);
    return W;
  }

  lift(Lmag){  
    // lift direction y
    let L = new THREE.Vector3(Lmag * Math.cos(this.AOA), Lmag * Math.sin(this.AOA), 0);
   
    // this.applyForce(L);
    return L;
  }

  drag(Dmag){
    // drag direction -x
    let D = new THREE.Vector3(-Dmag * Math.sin(this.AOA), Dmag * Math.cos(this.AOA),0);
 
    // this.applyForce(D);
    return D;
  }

  currentVelocity = (vel) => {
    return Math.sqrt(vel.x * vel.x + vel.y * vel.y + vel.z * vel.z);
  };

  execute(deltaTime) {
    // gravity on the glider
    // later you should make the height same as the position.y
    let gravity = this.world.calc_gravity(this.height);
    let g = new THREE.Vector3(0, - gravity, 0); // gravity vector
        
    // Calculate Lift and Drag magnitude
    let q = this.calc_q();    
    let Lmag = this.CL * q * this.S;  // L = CL.q.S
    let Dmag = this.CD * q * this.S;  // D = CD.q.S

    // angel of attack
    this.AOA = Math.tan(Dmag / Lmag);
    this.mesh.rotation.x = this.AOA;
      
    // rotate the glider
    this.mesh.rotation.x = this.AOA;

    //calc the forces
    let W =  this.weight(g);
    let L =  this.lift(Lmag);
    let D =  this.drag(Dmag);
    
    if(L.y + D.y <= -W.y){
      this.F.x = L.x + D.x + W.x;
      this.F.y = L.y + D.y + W.y;
      this.F.z = L.z + D.z + W.z;
      this.acc = this.F.clone().divideScalar(this.mass)
    }
    else{
      this.acc.set(0,0,0)
    }    
    
    // Update the velocity based on the acceleration [v = v + (a*dt)]
    this.vel.add(this.acc.clone().multiplyScalar(deltaTime));
    let v = this.currentVelocity(this.vel);

    // Update the position based on the velocity [r = r + (v*dt)]
    this.mesh.position.add(this.vel.clone().multiplyScalar(deltaTime));

    this.edges();

    // print
    // console.log("L.y + D.y", L.y + D.y);
    // console.log("W.y", W.y)
    // console.log("ffff", this.F)
    // console.log("aaaa", this.acc);
    // console.log('q: ', q);
    // console.log("AOA", this.AOA);
    // console.log('W: ', W);
    // console.log('L: ', L);
    // console.log('D: ', D);
    // console.log('L/D ratio: ', Lmag / Dmag);
    console.log('V: ', this.vel);
    console.log('position in phsics: ', this.mesh.position);

    return {
      position: this.mesh.position
    };
   
  };
}
export default Glider;