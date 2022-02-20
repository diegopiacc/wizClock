import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// flags shaders
import vertexShader from "./glsl/vertex.glsl";
import fragmentShader from "./glsl/fragment.glsl";

//cogwheel shaders
import slowlyRotatingVertices from "./glsl/slowlyRotatingVertices.glsl";
import textureFragmentShader from "./glsl/textureFragmentShader.glsl";

//// background - simple shader for debug
//import spaceShader from "./glsl/space1.glsl";

// "heavy" shader for production
import spaceShader from "./glsl/space_heavy.glsl";

import clockLbl1 from "../assets/wizClock_casa.png";
import clockLbl2 from "../assets/wizClock_nonni.png";
import clockLbl3 from "../assets/wizClock_maneggio.png";
import clockLbl4 from "../assets/wizClock_lavoro.png";
import clockLbl5 from "../assets/wizClock_scuola.png";
import clockLbl6 from "../assets/wizClock_inviaggio.png";
import clockLbl7 from "../assets/wizClock_chiesa.png";
import clockLbl8 from "../assets/wizClock_stalla.png";
import clockLbl9 from "../assets/wizClock_spesa.png";
import clockLbl10 from "../assets/wizClock_montagna.png";
import clockLbl11 from "../assets/wizClock_vialta.png";
import clockLbl12 from "../assets/wizClock_none.png";

import bronze from "../assets/bronze.jpg";
import silver1 from "../assets/silver.jpg";

import portrait_1 from "../assets/wizClock_portrait_1.png"
import portrait_2 from "../assets/wizClock_portrait_2.png"
import portrait_3 from "../assets/wizClock_portrait_3.png"
import portrait_4 from "../assets/wizClock_portrait_4.png"

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


  createSilverShader() {
    return new THREE.ShaderMaterial({
      vertexShader: slowlyRotatingVertices,
      fragmentShader: textureFragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        speedFactor: { value: 0.2 },
        uTexture: { value: new THREE.TextureLoader().load(silver1) }
      },
      wireframe: false
    });
  }

  createMesh() {
    this.pennantGeometry = new THREE.PlaneGeometry(0.6, 0.22, 24, 2);
    this.pennantGeometryBig = new THREE.PlaneGeometry(0.6, 0.4, 24, 2);
    this.geometrySlonger = new THREE.PlaneGeometry(0.7, 0.22, 24, 2);
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
    this.hand1Material = this.createSilverShader();
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
            object.position.set(0.6, 0.6, -0.15);
            object.scale.set(0.4, 0.4, 0.4);
            object.material = self.cog2Material;
          }
      });
    });

    /* hands and small portrait figurines */
    


let textureMaps = [];
textureMaps[0] = null;
textureMaps[1] = new THREE.TextureLoader().load(portrait_1);
textureMaps[2] = new THREE.TextureLoader().load(portrait_2);
textureMaps[3] = new THREE.TextureLoader().load(portrait_3);
textureMaps[4] = new THREE.TextureLoader().load(portrait_4);

for(let fi=1; fi<5; fi++) {

      loader.load(
        "./hand_00"+fi+".glb",
        function(data) {
        data.scene.traverse( function( object )
        {
        if ((object instanceof THREE.Mesh)) {
          self.scene.add( object );
          object.position.set(0, 0, 0.25);
          object.scale.set(2, 2, 2);
          object.material = self.hand1Material;
          object.name = "hand_"+fi;
console.log("adding " +  object.name);
        }
        });
      });


      const geometry = new THREE.CircleGeometry( 0.07, 16 );
      const material = new THREE.MeshBasicMaterial( { map: textureMaps[fi] } );
      const circle = new THREE.Mesh( geometry, material );
      circle.name = "figurine_"+fi;
      this.scene.add( circle );
    }









    // this.cog1geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // this.cog1mesh = new THREE.Mesh( self.cog1geometry, this.cogMaterial );
    // this.scene.add( this.cog1mesh );


    /*   */
    this.material12 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl12) }
      },
      transparent: true
    });
    this.mesh12oclock = new THREE.Mesh(this.pennantGeometryBig, this.material12);
    this.scene.add(this.mesh12oclock);
    this.mesh12oclock.position.set(0, 1, 0.1);
	
	/*   */

    this.material1 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl1) }
      },
      transparent: true
    });
    this.mesh1oclock = new THREE.Mesh(this.pennantGeometry, this.material1);
    this.scene.add(this.mesh1oclock);
    this.mesh1oclock.position.set(0.5, 0.8660254, 0);

    /*   */

    this.material2 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl2) }
      },
      transparent: true
    });
    this.mesh2oclock = new THREE.Mesh(this.geometrySlonger, this.material2);
    this.scene.add(this.mesh2oclock);
    this.mesh2oclock.position.set(0.8660254, 0.5, 0);

	/*   */

    this.material3 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl3) }
      },
      transparent: true
    });
    this.mesh3oclock = new THREE.Mesh(this.geometrySlonger, this.material3);
    this.scene.add(this.mesh3oclock);
    this.mesh3oclock.position.set(1, 0, 0);
		
	/*   */

    this.material4 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl4) }
      },
      transparent: true
    });
    this.mesh4oclock = new THREE.Mesh(this.geometrySlonger, this.material4);
    this.scene.add(this.mesh4oclock);
    this.mesh4oclock.position.set(0.8660254, -0.5, 0);


    /*   */
	
	this.material5 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl5) }
      },
      transparent: true
    });
    this.mesh5oclock = new THREE.Mesh(this.geometrySlonger, this.material5);
    this.scene.add(this.mesh5oclock);
    this.mesh5oclock.position.set(0.5, -0.8660254, 0);
		
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
    this.mesh6oclock = new THREE.Mesh(this.geometrySlonger, this.material6);
    this.scene.add(this.mesh6oclock);
    this.mesh6oclock.position.set(0, -1, 0.1);

    /*   */
	
    this.material7 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl7) }
      },
      transparent: true
    });
    this.mesh7oclock = new THREE.Mesh(this.pennantGeometry, this.material7);
    this.scene.add(this.mesh7oclock);
    this.mesh7oclock.position.set(-0.5, -0.8660254, 0);

    /*   */
	
    this.material8 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl8) }
      },
      transparent: true
    });
    this.mesh8oclock = new THREE.Mesh(this.geometrySlonger, this.material8);
    this.scene.add(this.mesh8oclock);
    this.mesh8oclock.position.set(-0.8660254, -0.5, 0);

    /*   */

    this.material9 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl9) }
      },
      transparent: true
    });
    this.mesh9oclock = new THREE.Mesh(this.geometrySlonger, this.material9);
    this.scene.add(this.mesh9oclock);
    this.mesh9oclock.position.set(-1, 0, 0);

    /*   */

    this.material10 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl10) }
      },
      transparent: true
    });
    this.mesh10oclock = new THREE.Mesh(this.geometrySlonger, this.material10);
    this.scene.add(this.mesh10oclock);
    this.mesh10oclock.position.set(-0.8660254, 0.5, 0);

    /*   */
	
    this.material11 = new THREE.ShaderMaterial({
      vertexShader, fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uTexture: { value: new THREE.TextureLoader().load(clockLbl11) }
      },
      transparent: true
    });
    this.mesh11oclock = new THREE.Mesh(this.pennantGeometry, this.material11);
    this.scene.add(this.mesh11oclock);
    this.mesh11oclock.position.set(-0.5, 0.8660254, 0);

    /*   */

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

    // update times
    let time = this.clock.getElapsedTime();
    this.materialbg1.uniforms.uTime.value = time;
    this.cog1Material.uniforms.uTime.value = time;
    this.cog1Material.uniforms.speedFactor.value = 0.1;
    this.cog2Material.uniforms.uTime.value = time;
    this.cog2Material.uniforms.speedFactor.value = 0.4;
    this.material12.uniforms.uTime.value = time;
    this.material1.uniforms.uTime.value = time;
    this.material2.uniforms.uTime.value = time;
    this.material3.uniforms.uTime.value = time;
    this.material4.uniforms.uTime.value = time;
    this.material5.uniforms.uTime.value = time;
    this.material6.uniforms.uTime.value = time;
    this.material7.uniforms.uTime.value = time;
    this.material8.uniforms.uTime.value = time;
    this.material9.uniforms.uTime.value = time;
    this.material10.uniforms.uTime.value = time;
    this.material11.uniforms.uTime.value = time;
    this.renderer.render(this.scene, this.camera);

    // update hands



  }

  setHandHour(hand, hour) {
    console.log("setHandHour ", hand, hour);
    let halfPi = 0.5 * Math.PI;
    let rot = Math.PI * hour / 6.0;
    let obj = this.scene.getObjectByName("hand_"+hand);
    if(obj) {
      obj.rotation.set(0, 0, -rot);
	  /*
      const q1 = new THREE.Quaternion();
      q1.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), halfPi );
      const q2 = new THREE.Quaternion();
      q2.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), -rot );
      q1.multiply(q2);
      obj.rotation.setFromQuaternion(q1);
	  */
    } else {
      console.log(" [ Hand rotation set error ] - cannot find obj hand_"+hand);
    }
    //
    // figurine
    let fobj = this.scene.getObjectByName("figurine_"+hand);
    let figurineDistance = 0.72 - 0.1 * hand;
    let figurineDistanceZ = 0.16 + 0.056 * hand;
    if(fobj) {
      fobj.position.set(figurineDistance * Math.sin(rot), figurineDistance * Math.cos(rot), figurineDistanceZ);
    } else {
      console.log(" [ Figurine set error ] - cannot find obj figurine_"+hand);
    }
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
