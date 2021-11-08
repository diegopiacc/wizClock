precision mediump float;

varying vec2 vUv;
uniform sampler2D uTexture;

void main() {
  vec4 texture = texture2D(uTexture, vUv).rgba;
  gl_FragColor = texture;
}