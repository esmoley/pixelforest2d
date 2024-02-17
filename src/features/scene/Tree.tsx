import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { Cell } from "./World";

export class TreeGene {
    left=0;
    right=0;
    up=0;
    down=0;
}
type ActiveTreeCell = {
    cell: Cell
    gene: TreeGene
}
const isGrounded = (cell:Cell, field:(Cell | null)[][])=>{
    if(cell.y === 0) return true
    return field[cell.x][cell.y-1]? true: false
}

export class TreeGeneGenerator{
    generate(){
        const genes:TreeGene[] = []
        for(let i=0;i<16;i++){
            genes.push({
                left:Math.floor(Math.random() * 40),
                right: Math.floor(Math.random() * 40),
                up: Math.floor(Math.random() * 40),
                down: Math.floor(Math.random() * 40),
            })
        }
        return genes
    }    
}

export type TreeProps = {
    initialCell:Cell
    genes:TreeGene[]
    translateX: (x:number)=>number
    translateY: (y:number)=>number
    isCellEmpty: (x:number, y:number)=>boolean
    cells: (Cell | null)[][]
}
export const Tree = ({initialCell, genes, translateX, translateY, isCellEmpty, cells} : TreeProps) =>{
    const lifetime = useAppSelector(x=>x.scene.lifetime)
    const [actorCells, setActorCells] = useState([initialCell])
    const [activeCells, setActiveCells] = useState([{cell:initialCell, gene:genes[0]} as ActiveTreeCell])
    
    useEffect(()=>{
        // empty initial cells
        const newActorCells = actorCells.map(x=>x)

        newActorCells.map(itemCell=>{
            cells[itemCell.x][itemCell.y] = null
        })
        
        // fall if not grounded
        if(!isGrounded(newActorCells[0], cells)){
            newActorCells.map(c=>c.y--)
        }else{ // otherwise grow
            const newActiveCells = []
            for(let activeCell of activeCells){
                if(activeCell.gene.left<genes.length){
                    const x = translateX(activeCell.cell.x-1)
                    const y = activeCell.cell.y
                    if(isCellEmpty(x, y) && newActorCells.find(c=>c.x==x && c.y == y)==null){
                        const cell = {color:newActorCells[0].color, x, y} as Cell
                        const gene = genes[activeCell.gene.left]
                        newActiveCells.push({ cell, gene })
                        newActorCells.push(cell)
                    }
                }
                if(activeCell.gene.right<genes.length){
                    const x = translateX(activeCell.cell.x+1)
                    const y = activeCell.cell.y
                    if(isCellEmpty(x, y) && newActorCells.find(c=>c.x==x && c.y == y)==null){
                        const cell = {color:newActorCells[0].color, x, y} as Cell
                        const gene = genes[activeCell.gene.right]
                        newActiveCells.push({ cell, gene })
                        newActorCells.push(cell)
                    }
                }
                if(activeCell.gene.up<genes.length){
                    const x = activeCell.cell.x
                    const y = translateY(activeCell.cell.y+1)
                    if(isCellEmpty(x, y) && newActorCells.find(c=>c.x==x && c.y == y)==null){
                        const cell = {color:newActorCells[0].color, x, y} as Cell
                        const gene = genes[activeCell.gene.up]
                        newActiveCells.push({ cell, gene })
                        newActorCells.push(cell)
                    }
                }
                if(activeCell.gene.down<genes.length){
                    const x = activeCell.cell.x
                    const y = translateY(activeCell.cell.y-1)
                    if(isCellEmpty(x, y) && newActorCells.find(c=>c.x==x && c.y == y)==null){
                        const cell = {color:newActorCells[0].color, x, y} as Cell
                        const gene = genes[activeCell.gene.down]
                        newActiveCells.push({ cell, gene })
                        newActorCells.push(cell)
                    }
                }
            }
            setActiveCells(newActiveCells)
        }
        setActorCells(newActorCells)
        // place cells
        newActorCells.map(itemCell=>{
            cells[itemCell.x][itemCell.y] = itemCell
        })
    },[lifetime])

    return <></>
}