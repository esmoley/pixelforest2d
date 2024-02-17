import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { setStarted, setWorldResetRequested } from "./sceneSlice"
import { Grid } from "./Grid"
import * as THREE from "three"
import { TreeGene, TreeGeneGenerator } from "./Tree"
import { Tree } from "./Tree"


type FieldProps = {
    scene: THREE.Scene,
    render: ()=>void
}
export type Cell = {
    color:string,
    x:number,
    y:number
}

const colors = ["#5B5280","#6074AB","#74A0D1","#95C3E9","#C0E5F3","#FAFFE0","#E3E0D7","#C3B8B1","#A39391","#8D7176","#6A4C62","#4E3161","#421E42","#612447","#7A3757","#96485B","#BD6868","#D18B79","#DBAC8C","#E6CFA1","#E7EBBC","#B2DBA0","#87C293","#70A18F","#637C8F","#B56E75","#C98F8F","#DFB6AE","#EDD5CA","#BD7182","#9E5476","#753C6A"]

const randomColor = () => colors[Math.floor(Math.random()*(colors.length))]
const initialColor = "#000000"
const initialColorObj = new THREE.Color(initialColor)

const dummy = new THREE.Object3D();
const cells:(Cell | null)[][] = []

export const World = ({scene, render}:FieldProps)=>{
    const dispatch = useAppDispatch()
    const width = useAppSelector(x=>x.scene.width)
    const height = useAppSelector(x=>x.scene.height)
    
    const instanceMesh:THREE.InstancedMesh = useMemo(()=>{
        const res = new THREE.InstancedMesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial(), width*height)
        res.instanceMatrix.setUsage( THREE.DynamicDrawUsage )
        let meshIndex = 0
        for(let x=0;x<width;x++){
            for(let y=0;y<height;y++){
                dummy.position.set(x,y,-1)
                dummy.updateMatrix()
                res.setColorAt(meshIndex, initialColorObj)
                res.setMatrixAt(meshIndex, dummy.matrix)
                meshIndex++
            }
        }
        res.instanceMatrix.needsUpdate = true;
        scene.add(res)
        return res
    },[])
    useMemo(()=>{
        const res = new Grid()
        res.width = width
        res.height = height
        scene.add( ...res.createLines(new THREE.LineBasicMaterial( { color: 0x444444 } )))
        return res
    },[]);

    const lifetime = useAppSelector(x=>x.scene.lifetime)
    const worldResetRequested = useAppSelector(x=>x.scene.worldResetRequested)
    const lockX = useAppSelector(x=>x.scene.lockX)
    const lockY = useAppSelector(x=>x.scene.lockY)
    const [inactivity, setInactivity] = useState(0)
    const [trees, setTrees] = useState([] as {key:number, initialCell: Cell, genes: TreeGene[]}[])

    const resetCells = ()=>{
        for(let x=0;x<width;x++){
            cells[x] = new Array(height).fill(null)
        }
    }
    const translateX = (x:number) =>{
        if(lockX)return x
        while(x<0)x+= width;
        while(x>=width)x-= width
        return x
    }
    const translateY = (y:number) =>{
        if(lockY)return y
        while(y<0)y+=height
        while(y>=height)y-=height
        return y
    }
    const isCellEmpty = (x:number, y:number)=>{
        if(lockY && (y<0 || y>= height)) return false;
        if(lockX && (x<0 || x>= width)) return false;
        return cells[x][y]==null
    }
    const paint = ()=>{
        let meshIndex = 0;
        let dummyColor = new THREE.Color(0x000000)
        let inactive = true
        for(let x=0;x<width;x++){
            for(let y=0;y<height;y++){
                instanceMesh.getColorAt(meshIndex, dummyColor)
                if(!cells[x][y] && !dummyColor.equals(initialColorObj)){
                    instanceMesh.setColorAt(meshIndex, initialColorObj)
                    inactive = false
                }else if(cells[x][y] && cells[x][y]?.color != dummyColor.getHexString()){
                    instanceMesh.setColorAt(meshIndex, new THREE.Color(cells[x][y]?.color))
                    inactive = false
                }
                meshIndex++
            }
        }
        if(inactive){
            setInactivity(inactivity+1)
            console.log(inactivity)
            return
        }
        if(instanceMesh.instanceColor)instanceMesh.instanceColor.needsUpdate = true
    }
    
    //reset
    useEffect(()=>{
        if(!worldResetRequested) return
        setInactivity(0)
        const randomX = ()=> Math.floor(Math.random()*width)
        const randomY = ()=> Math.floor(Math.random()*(height/4))
        const newTrees = [] 
        for (let i=0;i<32;i++)
        {
            newTrees.push({
                key: Math.random(),
                initialCell: {color:randomColor(), x:randomX(), y:randomY()} as Cell,
                genes: new TreeGeneGenerator().generate()
            })
        }
        dispatch(setWorldResetRequested(false))
        setTrees(newTrees)
        resetCells()
        render()
    },[worldResetRequested])

    //update
    useEffect(()=>{
        if(inactivity>5){
            dispatch(setStarted(false))
        }
        paint()
    },[lifetime])

    return <>
    {trees.map((tree)=>
        <Tree {...tree}
            isCellEmpty={isCellEmpty}
            translateX={translateX}
            translateY={translateY}
            cells={cells}
        />)}
    </>
}