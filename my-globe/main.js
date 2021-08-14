import './style.css'
import { 
  AdditiveBlending, BackSide, BufferGeometry, Float32BufferAttribute, Group, 
  Mesh, MeshBasicMaterial, PerspectiveCamera, 
  Points, PointsMaterial, 
  Scene, ShaderMaterial, SphereGeometry, 
  TextureLoader, WebGLRenderer 
} from 'three';
import gsap from 'gsap';
import vertexShader from './src/shaders/vertex.glsl';
import fragmentShader from './src/shaders/fragment.glsl';
import atmosphereVertexShader from './src/shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './src/shaders/atmosphereFragment.glsl';

const earthCanvas = document.querySelector('#earthCanvas');
const earthCanvasContainer = document.querySelector('#earthCanvasContainer');

const scene = new Scene();

// const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
const camera = new PerspectiveCamera(75, earthCanvasContainer.offsetWidth / earthCanvasContainer.offsetHeight, 0.1, 1000);
camera.position.z = 15;

const renderer = new WebGLRenderer({
  antialias: true,
  canvas: earthCanvas
});
renderer.setSize(earthCanvasContainer.offsetWidth, earthCanvasContainer.offsetHeight);
// renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
// document.body.appendChild(renderer.domElement);

// create a sphere
const sphereGeo = new SphereGeometry(5, 50, 50);
const sphereMaterial = new ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    globeTexture: {
      value: new TextureLoader().load('./src/img/earth_uv_map.jpg')
    }
  }
});
// const sphereMaterial = new MeshBasicMaterial({
//   // color: 0xff0000
//   map: new TextureLoader().load('./src/img/earth_uv_map.jpg')
// });
const sphere = new Mesh(sphereGeo, sphereMaterial);

// create a brighter atmosphere
const atmosphereGeo = new SphereGeometry(5, 50, 50);
const atmosphereMaterial = new ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  blending: AdditiveBlending,
  side: BackSide
});
const atmosphere = new Mesh(atmosphereGeo, atmosphereMaterial);
atmosphere.scale.set(1.1, 1.1, 1.1);

// add atmosphere to scene
scene.add(atmosphere);

const group = new Group();
group.add(sphere);

// add group with sphere to scene
scene.add(group);

// create stars in the background
const starGeo = new BufferGeometry();
const starMaterial = new PointsMaterial({
  color: 0xffffff
})

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 2000;
  starVertices.push(x, y, z);
}

// assign the star vertices array and tell that data is by 3 (since a vertex is by x, y, z).
starGeo.setAttribute('position', new Float32BufferAttribute(starVertices, 3));

// similar to Mesh
const stars = new Points(starGeo, starMaterial);

// add stars to scene
scene.add(stars);

const mouse = {
  x: 0,
  y: 0
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.001;
  // group.rotation.y = mouse.x * 0.5;
  gsap.to(group.rotation, {
    x: -mouse.y * 0.3,
    y: mouse.x * 0.5,
    duration: 2
  });
}

animate();

addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = (event.clientY / innerHeight) * 2 + 1;
});

