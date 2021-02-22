import * as THREE from "three";
import { CubeCamera } from "three";
let OrbitControls = require("three-orbit-controls")(THREE);

import fragment from "./shader/fragment.glsl";
import vertex from "./shader/vertex.glsl";
import fragmentSun from "./shaderSun/fragment.glsl";
import vertexSun from "./shaderSun/vertex.glsl";
import * as dat from "dat.gui";
// import gasp from "gsap";


export default class Sketch {
  constructor(options) {
    this.scene = new THREE.Scene();

    this.container = options.dom;
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xeeeeee, 1); 
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000
    );

    // var frustumSize = 10;
    // var aspect = window.innerWidth / window.innerHeight;
    // this.camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -1000, 1000 );
    this.camera.position.set(0, 0, 2);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.isPlaying = true;

    this.addTexture();
    this.addObjects();
    this.resize();
    this.render();
    this.setupResize();
    // this.settings();
  }

  addTexture() {
      // Create cube render target
      this.scene1 = new THREE.Scene();
      
      this.cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget( 256, { format: THREE.RGBFormat,
      generateMipmaps:true, minFilter: THREE.LinearMipmapLinearFilter, encoding: THREE.sRGBEncoding } );

       this.cubeCamera1 = new THREE.CubeCamera(1, 10, this.cubeRenderTarget1)


      this.materialuPerlin = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: { type: "f", value: 0 },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector4(1, 1)
        }
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });

    this.geometry = new THREE.SphereGeometry(1, 30, 30);

    this.perlin = new THREE.Mesh(this.geometry, this.materialuPerlin);
    this.scene.add(this.perlin);

  };

  settings() {
    let that = this;
    this.settings = {
      progress: 0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, "progress", 0, 1, 0.01);
  }

  setupResize() {
    window.addEventListener("resize", this.resize.bind(this));
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
  }

  addObjects() {
    let that = this;
    
    this.materialSun = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
      side: THREE.DoubleSide,
      uniforms: {
        time: {  value: 0 },
        uPerlin: {value: null},
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        }
      },
      // wireframe: true,
      // transparent: true,
      vertexShader: vertexSun,
      fragmentShader: fragmentSun
    });

    this.geometry = new THREE.SphereGeometry(1, 30, 30);
    this.sun = new THREE.Mesh(this.geometry, this.materialSun);
    
    this.scene1.add(this.sun);
  }

  stop() {
    this.isPlaying = false;
  }

  play() {
    if(!this.isPlaying){
      this.render()
      this.isPlaying = true;
    }
  }

  render() {
    if (!this.isPlaying) return;

    this.cubeCamera1.update(this.renderer, this.scene1);
    this.materialSun.uniforms.uPerlin.value = this.cubeRenderTarget1.texture;

    this.time += 0.05;
    this.materialuPerlin.uniforms.time.value = this.time;
    this.materialSun.uniforms.time.value = this.time;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}

new Sketch({
  dom: document.getElementById("container")
});
