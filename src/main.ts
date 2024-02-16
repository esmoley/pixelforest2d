import * as THREE from 'three';
import { World } from './domain/valueobjects/world';
import { TreeWorldItem } from './domain/entites/world/tree.world.item';
import { WorldCell } from './domain/entites/world/world.cell';
import { TreeGeneGenerator } from './domain/generators/tree_gene_generator';

let world: World = new World(new THREE.Scene());
world.createGrid();
//const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const width = window.innerWidth
const height = window.innerHeight
const scale= 10
const camera = new THREE.OrthographicCamera(width / - scale, width / scale, height / scale, height / - scale, 1, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

camera.position.x = 128;
camera.position.y = 64;
camera.position.z = 1;

let steps = 0
const step = 50
let started = false

//#region controls
const controlsElement = document.getElementById("controls") as HTMLElement
const gridStep = document.createElement("div")
controlsElement.appendChild(gridStep)

const startButton = document.createElement("button")
startButton.innerHTML = "Start"
controlsElement.appendChild(startButton)
startButton.onclick = () => {
  started = true
  updateControls()
}

const pauseButton = document.createElement("button")
pauseButton.innerHTML = "Pause"
controlsElement.appendChild(pauseButton)
pauseButton.onclick = ()=>{
  started = false
  updateControls()
}

const stopButton = document.createElement("button")
stopButton.innerHTML = "Stop"
controlsElement.appendChild(stopButton)
stopButton.onclick = ()=>{
  started = false
  steps = 0
  updateControls()
  resetWorld()
}
function updateControls(){
  if(started){
    pauseButton.style.display = "unset"
    startButton.style.display = "none"
    stopButton.style.display = "unset"
  }else{
    pauseButton.style.display = "none"
    startButton.style.display = "unset"
    stopButton.style.display = steps == 0 ? "none" : "unset"
  }
}
updateControls()

const colors = [0x5B5280,0x6074AB,0x74A0D1,0x95C3E9,0xC0E5F3,0xFAFFE0,0xE3E0D7,0xC3B8B1,0xA39391,0x8D7176,0x6A4C62,0x4E3161,0x421E42,0x612447,0x7A3757,0x96485B,0xBD6868,0xD18B79,0xDBAC8C,0xE6CFA1,0xE7EBBC,0xB2DBA0,0x87C293,0x70A18F,0x637C8F,0xB56E75,0xC98F8F,0xDFB6AE,0xEDD5CA,0xBD7182,0x9E5476,0x753C6A]
//#endregion controls
function randomColor(){
  return colors[Math.floor(Math.random()*(colors.length-1))]
}
function resetWorld(){
  world.reset()
  const randomX = ()=> Math.floor(Math.random()*world.getWidth())
  const randomY = ()=> Math.floor(Math.random()*(world.getHeight()/4))
  const addTree = (color:THREE.Color) =>new TreeWorldItem(world, new WorldCell(color, randomX(),randomY()), new TreeGeneGenerator().generate())
  for (let i=0;i<32;i++)
  {
    addTree(new THREE.Color(randomColor()))  
  }
}
resetWorld()
function animate() {
  setTimeout(()=>requestAnimationFrame( animate ), step)
  if(started){
    steps++;
    world.update()
  }
	gridStep.innerText = "Step: " + steps
  renderer.render( world.scene, camera );
}

animate();