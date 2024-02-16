import { World } from "../../valueobjects/world";
import { TreeGene } from "./tree.gene";
import { WorldCell } from "./world.cell";
import { WorldItem } from "./world.item";

type ActiveTreeCell = {
    cell: WorldCell
    gene: TreeGene
}
export class TreeWorldItem extends WorldItem{
    activeCells:ActiveTreeCell[]
    constructor(world:World, position:WorldCell, private genes:TreeGene[]){
        super(world, [position])
        this.activeCells = [{cell:position, gene: genes[0]}]
    }
    update(){
        super.update()
        if(this.cells[0].getY() !== 0)return
        this.grow()
    }
    grow(){
        const activeCells = this.activeCells
        this.activeCells = []
        for(let activeCell of activeCells){
            if(activeCell.gene.left<this.genes.length){
                const x = this.world.translateX(activeCell.cell.getX()-1)
                const y = activeCell.cell.getY()
                if(this.world.isCellEmpty(x, y) && this.cells.find(c=>c.getX()==x && c.getY() == y)==null){
                    const cell = new WorldCell(this.cells[0].color, x, y)
                    const gene = this.genes[activeCell.gene.left]
                    this.activeCells.push({ cell, gene })
                    this.cells.push(cell)
                }
            }
            if(activeCell.gene.right<this.genes.length){
                const x = this.world.translateX(activeCell.cell.getX()+1)
                const y = activeCell.cell.getY()
                if(this.world.isCellEmpty(x, y) && this.cells.find(c=>c.getX()==x && c.getY() == y)==null){
                    const cell = new WorldCell(this.cells[0].color, x, y)
                    const gene = this.genes[activeCell.gene.right]
                    this.activeCells.push({ cell, gene })
                    this.cells.push(cell)
                }
            }
            if(activeCell.gene.up<this.genes.length){
                const x = activeCell.cell.getX()
                const y = activeCell.cell.getY()+1
                if(this.world.isCellEmpty(x, y) && this.cells.find(c=>c.getX()==x && c.getY() == y)==null){
                    const cell = new WorldCell(this.cells[0].color, x, y)
                    const gene = this.genes[activeCell.gene.up]
                    this.activeCells.push({ cell, gene })
                    this.cells.push(cell)
                }
            }
            if(activeCell.gene.down<this.genes.length){
                const x = activeCell.cell.getX()
                const y = activeCell.cell.getY()-1
                if(this.world.isCellEmpty(x, y) && this.cells.find(c=>c.getX()==x && c.getY() == y)==null){
                    const cell = new WorldCell(this.cells[0].color, x, y)
                    const gene = this.genes[activeCell.gene.down]
                    this.activeCells.push({ cell, gene })
                    this.cells.push(cell)
                }
            }
        }
    }
}