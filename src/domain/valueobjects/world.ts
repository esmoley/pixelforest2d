import * as THREE from "three";
import { Grid } from './grid';
import { WorldItem } from "../entites/world/world.item";
import { WorldCell } from "../entites/world/world.cell";

export class World{
    private width: number = 256;
    private height: number = 128;
    public grid?:Grid;
    public cells: WorldCell[][] | null[][];
    public lockY = false
    public lockX = false
    public speed = 1
    worldItems:WorldItem[] = []
    public inactivity = 0

    private instanceMesh:THREE.InstancedMesh;
    private initialColor = new THREE.Color(0x000000)
    private dummy = new THREE.Object3D();
    meshIndexFromXY(x:number, y:number){
        return this.height*x+y
    }
    constructor(public scene:THREE.Scene){
        this.cells = new Array(this.width).fill(null).map(()=>new Array(this.height).fill(null))
        this.instanceMesh = new THREE.InstancedMesh(new THREE.PlaneGeometry(), new THREE.MeshBasicMaterial(), this.width*this.height)
        this.instanceMesh.instanceMatrix.setUsage( THREE.StaticDrawUsage )
        let meshIndex = 0
        for(let x=0;x<this.width;x++){
            for(let y=0;y<this.height;y++){
                this.dummy.position.set(x,y,-1)
                this.dummy.updateMatrix()
                this.instanceMesh.setColorAt(meshIndex, this.initialColor)
                this.instanceMesh.setMatrixAt(meshIndex, this.dummy.matrix)
                meshIndex++
            }
        }
        this.instanceMesh.instanceMatrix.needsUpdate = true;
        this.scene.add(this.instanceMesh)
    }
    getWidth(){
        return this.width
    }
    getHeight(){
        return this.height
    }
    resetCells(){
        this.cells = new Array(this.width).fill(null).map(()=>new Array(this.height).fill(null))
    }
    addGrid(){
        if(this.grid)return
        this.grid = new Grid()
        this.grid.width = this.width
        this.grid.height = this.height
        this.scene.add( ...this.grid.createLines(new THREE.LineBasicMaterial( { color: 0x444444 } )))
    }
    addItem(worldItem: WorldItem){
        this.worldItems.push(worldItem)
    }
    update(){
        this.worldItems.map(worldItem=>{
            // empty initial cells
            worldItem.cells.map(itemCell=>{
                this.cells[itemCell.getX()][itemCell.getY()] = null
            })
            worldItem.update()
            // place cells
            worldItem.cells.map(itemCell=>{
                this.cells[itemCell.getX()][itemCell.getY()] = itemCell
            })
        })
        this.paint()
    }
    private paint(){
        let meshIndex = 0;
        let dummyColor = new THREE.Color(0x000000)
        let inactive = true
        for(let x=0;x<this.width;x++){
            for(let y=0;y<this.height;y++){
                this.instanceMesh.getColorAt(meshIndex, dummyColor)
                if(!this.cells[x][y] && !dummyColor.equals(this.initialColor)){
                    this.instanceMesh.setColorAt(meshIndex, this.initialColor)
                    inactive = false
                }else if(this.cells[x][y] && !this.cells[x][y]?.color.equals(dummyColor)){
                    this.instanceMesh.setColorAt(meshIndex, this.cells[x][y]?.color as THREE.Color)
                    inactive = false
                }
                meshIndex++
            }
        }
        if(inactive){
            this.inactivity++
            console.log(this.inactivity)
            return
        }
        if(this.instanceMesh.instanceColor)this.instanceMesh.instanceColor.needsUpdate = true
    }
    reset(){
        this.dispose()
        this.resetCells()
        this.update()
    }
    dispose(){
        this.cells.map(x=>x.map(y=>{
            if(!y)return
            y.dispose()
        }))
        this.worldItems.length = 0
        this.inactivity = 0
    }
    translateX(x:number){
        if(this.lockX)return x
        while(x<0)x+=this.width;
        while(x>=this.width)x-=this.width
        return x
    }
    translateY(y:number){
        if(this.lockY)return y
        while(y<0)y+=this.height
        while(y>=this.height)y-=this.height
        return y
    }
    isCellEmpty(x:number, y:number){
        if(this.lockY && (y<0 || y>= this.height)) return false;
        if(this.lockX && (x<0 || x>= this.width)) return false;
        return this.cells[x][y]==null
    }
}