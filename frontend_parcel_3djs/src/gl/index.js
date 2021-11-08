import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";

import clockLbl12 from "../assets/test_pennant.png";
import clockLbl3 from "../assets/test_pennant.png";
import clockLbl6 from "../assets/test_pennant.png";

class Gl {
  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.camera.position.z = 1;
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#app"),
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xffffff, 1);

    this.clock = new THREE.Clock();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.onResize();
  }

  init() {
    this.createMesh();
    this.addEvents();
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(0.6, 0.2, 24, 8);

    // geometry is reusable, material no

    /*   */
    this.material12 = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl12) }
      },
      wireframe: false,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.mesh12oclock = new THREE.Mesh(this.geometry, this.material12);
    this.scene.add(this.mesh12oclock);
    this.mesh12oclock.position.set(0, 1, 0);

    /*   */

    this.material3 = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl3) }
      },
      wireframe: false,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.mesh3oclock = new THREE.Mesh(this.geometry, this.material3);
    this.scene.add(this.mesh3oclock);
    this.mesh3oclock.position.set(1, 0, 0);


    /*   */

    this.material6 = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl6) }
      },
      wireframe: false,
      transparent: true,
      side: THREE.DoubleSide
    });
    this.mesh6oclock = new THREE.Mesh(this.geometry, this.material6);
    this.scene.add(this.mesh6oclock);
    this.mesh6oclock.position.set(0, -1, 0);




  }

  addEvents() {
    window.requestAnimationFrame(this.run.bind(this));
    window.addEventListener("resize", this.onResize.bind(this), false);
  }

  run() {
    requestAnimationFrame(this.run.bind(this));
    this.render();
  }

  render() {
    this.material12.uniforms.uTime.value = this.clock.getElapsedTime();
    this.material3.uniforms.uTime.value = this.clock.getElapsedTime();
    this.material6.uniforms.uTime.value = this.clock.getElapsedTime();
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(w, h);
  }
}

export default Gl;
