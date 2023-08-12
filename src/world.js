import * as THREE from 'three';

// Define constants
const G0 =  9.80665,  // Gravitational constant
      RE =  6371000  ,   // Radius of the Earth m
      T0 = 288.15,    // Standard temperature
      P0 = 1.01325,   // Standard pressure
      R = 287.058,    // Gas constant
      L = -6.5/1000;  // change by 6.5 every 1000 m

class World{
  calc_gravity(height){
    // g = g0 * [RE / (RE + h)] ** 2   
    let g = G0 * Math.pow((RE / (RE + height)), 2);
    return g;
  }

  calc_pressure(height){
    let g = this.calc_gravity(height);
    // P = P0 * [1 + L * h / T0] ** -g/RL
    let P = P0 * Math.pow((1 + (L * height) / T0 ), (- g / (R * L)));
    return P;
  }

  calc_tempereture(height){
    // T = T0 + L * h 
    let T = T0 + (L * height / 1000); // temperature at height  
    return T;
  }

  calc_air_rho(height){
    let P = this.calc_pressure(height) * Math.pow(10, 5);
    let rho = P / (R * T0); // k/m3
    return rho;
  }
  
}
export default World;

// For Testing
// let w = new World();
// let w1 = new World();
// let w2 = new World();

// console.log(w.calc_air_rho(0));
// console.log(w1.calc_air_rho(1000));
// console.log(w2.calc_air_rho(5000));