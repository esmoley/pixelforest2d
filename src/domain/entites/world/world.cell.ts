import * as THREE from "three";

export class WorldCell{
    constructor(public color: THREE.Color, private x:number, private y:number){}
    getX(){
        return this.x
    }
    getY(){
        return this.y
    }
    setY(y:number){
        this.y=y
    }
    dispose(){

    }
}