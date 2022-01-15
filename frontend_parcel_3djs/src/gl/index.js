import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// flags shaders
import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";

//cogwheel shaders
import slowlyRotatingVertices from "./glsl/slowlyRotatingVertices.glsl";
import textureFragmentShader from "./glsl/textureFragmentShader.glsl";

// background - simple shader for debug
// import spaceShader from "./glsl/space1.glsl";

// "heavy" shader for production
import spaceShader from "./glsl/space_heavy.glsl";

import clockLbl12 from "../assets/wizClock_casa.png";
import clockLbl3 from "../assets/wizClock_maneggio.png";
import clockLbl6 from "../assets/wizClock_spesa.png";

import bronze from "../assets/bronze.jpg";

class Gl {
  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );

    this.camera.position.z = 4;
    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector("#app"),
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0, 1);

    this.clock = new THREE.Clock();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.onResize();
  }

  init() {
    this.createMesh();
    this.addEvents();
  }

  createMetalShader() {
    return new THREE.ShaderMaterial({
      vertexShader: slowlyRotatingVertices,
      fragmentShader: textureFragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        speedFactor: { value: 0.2 },
        uTexture: { value: new THREE.TextureLoader().load(bronze) }
      },
      wireframe: false
    });
  }

  createMesh() {
    this.geometry = new THREE.PlaneGeometry(0.6, 0.22, 24, 8);
    this.geometrySlonger = new THREE.PlaneGeometry(0.7, 0.22, 24, 8);
    this.bg_geom = new THREE.PlaneGeometry(20,20, 1, 1);

    // geometry is reusable, material no

    /* bg 1 */
    this.materialbg1 = new THREE.ShaderMaterial({
      fragmentShader: spaceShader,
      uniforms: {
        uTime: { value: 0.0 },
      },
      wireframe: false,
      transparent: true
    });
    this.meshbg1 = new THREE.Mesh(this.bg_geom, this.materialbg1);
    this.scene.add(this.meshbg1);
    this.meshbg1.position.set(0, 0, -20);


    /* CogWheels  */
    this.cog1Material = this.createMetalShader();
    this.cog2Material = this.createMetalShader();

	  var self = this;
    var loader = new GLTFLoader();
    loader.crossOrigin = true;
    loader.load(
      "./cogwheel_big_2.glb",
      function(data) {
      data.scene.traverse( function( object ) 
        {            // console.log('wiiiiiiiiiiiiiiii2',object);
          if ((object instanceof THREE.Mesh))
          {
            self.scene.add( object );
            object.position.set(0, 0, -0.1);
            object.material = self.cog1Material;
          }
      });
    });

    loader.load(
      "./cogwheel_small_1.glb",
      function(data) {
      data.scene.traverse( function( object ) 
        {            // console.log('wiiiiiiiiiiiiiiii2',object);
          if ((object instanceof THREE.Mesh))
          {
            self.scene.add( object );
            object.position.set(0.6, 0.6, -0.12);
            object.scale.set(0.4, 0.4, 0.4);
            object.material = self.cog2Material;
          }
      });
    });


    // this.cog1geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // this.cog1mesh = new THREE.Mesh( self.cog1geometry, this.cogMaterial );
    // this.scene.add( this.cog1mesh );


    /*   */
    this.material12 = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl12) }
      },
      wireframe: false,
      transparent: true
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
      transparent: true
    });
    this.mesh3oclock = new THREE.Mesh(this.geometrySlonger, this.material3);
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
      transparent: true
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
    let time = this.clock.getElapsedTime();
    // console.log('wiiii ', time)
    this.materialbg1.uniforms.uTime.value = time;
    this.cog1Material.uniforms.uTime.value = time;
    this.cog1Material.uniforms.speedFactor.value = 0.1;
    this.cog2Material.uniforms.uTime.value = time;
    this.cog2Material.uniforms.speedFactor.value = 0.4;
    this.material12.uniforms.uTime.value = time;
    this.material3.uniforms.uTime.value = time;
    this.material6.uniforms.uTime.value = time;
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
