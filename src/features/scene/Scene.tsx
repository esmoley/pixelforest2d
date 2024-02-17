import * as THREE from 'three';
import { World } from '../../domain/valueobjects/world';
import { TreeWorldItem } from '../../domain/entites/world/tree.world.item';
import { WorldCell } from '../../domain/entites/world/world.cell';
import { TreeGeneGenerator } from '../../domain/generators/tree_gene_generator';
import { useEffect, useMemo, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setLifetime, setWorldResetRequested } from './sceneSlice';

const colors = [0x5B5280,0x6074AB,0x74A0D1,0x95C3E9,0xC0E5F3,0xFAFFE0,0xE3E0D7,0xC3B8B1,0xA39391,0x8D7176,0x6A4C62,0x4E3161,0x421E42,0x612447,0x7A3757,0x96485B,0xBD6868,0xD18B79,0xDBAC8C,0xE6CFA1,0xE7EBBC,0xB2DBA0,0x87C293,0x70A18F,0x637C8F,0xB56E75,0xC98F8F,0xDFB6AE,0xEDD5CA,0xBD7182,0x9E5476,0x753C6A]
const scale = 10
const colorsCache :{[key:number]: THREE.Color}= {}
const randomColor = () => {
  const color = colors[Math.floor(Math.random()*(colors.length))]
  if(!colorsCache[color]){
    colorsCache[color] = new THREE.Color(color)
  }
  return colorsCache[color]
}

export const Scene = ({width, height} :{width:number, height:number})=>{
  const dispatch = useAppDispatch()

  const lifetime = useAppSelector(x=>x.scene.lifetime)
  //const nextUpdate = useAppSelector(x=>x.scene.nextUpdate)
  //const speed = useAppSelector(x=>x.scene.speed)
  const started = useAppSelector(x=>x.scene.started)
  const worldResetRequested = useAppSelector(x=>x.scene.worldResetRequested)
  const lockX = useAppSelector(x=>x.scene.lockX)
  const lockY = useAppSelector(x=>x.scene.lockY)

  const requestRef = useRef(0)
  const previousTimeRef = useRef(0);

  const world = useMemo(()=>new World(new THREE.Scene()),[])
  const camera = useMemo(()=>new THREE.OrthographicCamera(width / - scale, width / scale, height / scale, height / - scale, 1, 10),[])
  const renderer = useMemo(()=>new THREE.WebGLRenderer(),[])
  
  const animate = (time:number) =>{
    //if (previousTimeRef.current != undefined) {
    //   const deltaTime = time - previousTimeRef.current;
      
    //   // Pass on a function to the setter of the state
    //   // to make sure we always have the latest state
    //   setCount(prevCount => (prevCount + deltaTime * 0.01) % 100);
    
    //}
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);

    if(started){
      dispatch(setLifetime(lifetime+1));
      
      world.update()
    }
    renderer.render( world.scene, camera );
  }
  useEffect(()=>{
    world.addGrid();
    renderer.setSize( width, height );
    document.body.appendChild( renderer.domElement );
    camera.position.x = 128;
    camera.position.y = 64;
    camera.position.z = 1;
  },[])
  useEffect(()=>{
    world.lockX = lockX
  },[lockX])
  useEffect(()=>{
    world.lockY = lockY
  },[lockY])

  useEffect(()=>{
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  })
  useEffect(()=>{
    if(!worldResetRequested) return
    world.reset()
    const randomX = ()=> Math.floor(Math.random()*world.getWidth())
    const randomY = ()=> Math.floor(Math.random()*(world.getHeight()/4))
    const addTree = (color:THREE.Color) =>new TreeWorldItem(world, new WorldCell(color, randomX(),randomY()), new TreeGeneGenerator().generate())
    for (let i=0;i<32;i++)
    {
      addTree(randomColor())
    }
    dispatch(setWorldResetRequested(false))
  },[worldResetRequested])
  
  return <></>
}