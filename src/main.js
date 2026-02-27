import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


const canvas = document.querySelector('.webgl');

const scene = new THREE.Scene();

const ambientLight = new THREE.AmbientLight('white',1);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight('white',1);
directionalLight.position.set(1,2,3);
scene.add(directionalLight);

let model = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  '../src/static/models/Duck/glTF-Binary/Duck.glb',
  (gltf)=>{
    model = gltf.scene;
    model.position.y = -1.2
    scene.add(model);
  }

)

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({color:'red'})
)
object1.position.x = -2;
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({color:'red'})
)
object2.position.x = 0;
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({color:'red'})
)
object3.position.x = 2;

scene.add(object1, object2, object3);

const raycaster = new THREE.Raycaster();

const rayOrigin = new THREE.Vector3(-3,0,0);
const rayDirection = new THREE.Vector3(10,0,0);
rayDirection.normalize();

raycaster.set(rayOrigin, rayDirection);

const intersect = raycaster.intersectObject(object2);
// console.log(intersect);

const intersects = raycaster.intersectObjects([object1, object2, object3]);
// console.log(intersects);



const sizes ={
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize',()=>{
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})
const mouse = new THREE.Vector2();
window.addEventListener('mousemove',(event)=>{
  mouse.x = event.clientX/sizes.width *2 -1
  mouse.y = -(event.clientY/sizes.height *2-1)
})
window.addEventListener('click',()=>{
  if(currentIntersect){
    if(currentIntersect.object === object1){
      console.log("clicked on object1")
    }
    if(currentIntersect.object === object2){
      console.log("clicked on object2")
    }
    if(currentIntersect.object === object3){
      console.log("clicked on object3")
    }
  }

})
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 3;
// camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})

renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();
let currentIntersect = null;
function tick(){
  const elapsedTime = clock.getElapsedTime();

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // const rayOrigin = new THREE.Vector3(-3,0,0);
  // const rayDirection = new THREE.Vector3(1,0,0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);

  raycaster.setFromCamera(mouse,camera);

  const objectsToUpdate = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectsToUpdate)

  for(const object of objectsToUpdate){
    object.material.color.set('red');
  }
  for(const intersect of intersects){
    intersect.object.material.color.set('blue');
  }

  if(intersects.length){
    if(currentIntersect === null){
      console.log("mouse entered")
    }
    currentIntersect = intersects[0];
  }
  else{
    if(currentIntersect){
      console.log('mouse leaved');
    }
    currentIntersect = null;
  }
  if(model){
    const modelIntersect = raycaster.intersectObject(model);
    if(modelIntersect.length){
      // console.log(modelIntersect)
      model.scale.set(1.4,1.4,1.4);
    }
    else{
      model.scale.set(1,1,1);
    }
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}
tick();