import { World } from "../../valueobjects/world"
import { WorldCell } from "./world.cell"

export class WorldItem{
    constructor(protected world:World, public cells:WorldCell[]){
        world.addItem(this)
    }
    isGrounded(){
        if(this.cells.length==0)return false;
        if(this.cells[0].getY() === 0) return true
        const xCell = this.world.cells[this.cells[0].getX()]
        if(!xCell) return false
        return xCell[this.cells[0].getY()-1]? true: false
    }
    update(){
        if(this.cells.length == 0) return
        if(!this.isGrounded()){
            this.cells.map(x=>x.setY(x.getY()-1))
            return
        }
    }
}