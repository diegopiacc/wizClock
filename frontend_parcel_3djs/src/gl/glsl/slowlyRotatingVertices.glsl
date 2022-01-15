precision mediump float;

uniform float uTime;
uniform float speedFactor;

varying vec2 vUv; 

void main() {

  vUv = uv;
  
  float delta =  speedFactor * uTime;

  vec3 p = position.xyz;
  float new_x = p.x*cos(delta) - p.y*sin(delta);
  float new_y = p.y*cos(delta) + p.x*sin(delta);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(new_x, new_y, p.z, 1.0);
}