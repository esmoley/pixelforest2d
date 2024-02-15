
import { TreeGene } from "../entites/world/tree.gene"

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