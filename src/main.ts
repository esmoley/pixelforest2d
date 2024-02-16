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

//#endregion controls

function resetWorld(){
  world.reset()
  const randomX = ()=> Math.floor(Math.random()*world.getWidth())
  const randomY = ()=> Math.floor(Math.random()*(world.getHeight()/4))
  new TreeWorldItem(world, new WorldCell(new THREE.Color(0xEBD1E8), randomX(),randomY()), new TreeGeneGenerator().generate())
  new TreeWorldItem(world, new WorldCell(new THREE.Color(0xD3678D), randomX(),randomY()), new TreeGeneGenerator().generate())
  new TreeWorldItem(world, new WorldCell(new THREE.Color(0xEEA4CA), randomX(),randomY()), new TreeGeneGenerator().generate())
  new TreeWorldItem(world, new WorldCell(new THREE.Color(0xA6DDE8), randomX(),randomY()), new TreeGeneGenerator().generate())
  new TreeWorldItem(world, new WorldCell(new THREE.Color(0x9597BA), randomX(),randomY()), new TreeGeneGenerator().generate())
  new TreeWorldItem(world, new WorldCell(new THREE.Color(0xB7ABCE), randomX(),randomY()), new TreeGeneGenerator().generate())
  new TreeWorldItem(world, new WorldCell(new THREE.Color(0x20749E), randomX(),randomY()), new TreeGeneGenerator().generate())
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