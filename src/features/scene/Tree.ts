import {type Cell} from "./World";

export class TreeGene {
  left = 0;
  right = 0;
  up = 0;
  down = 0;
}

export class TreeGeneGenerator {
  generate() {
    const genes: TreeGene[] = [];
    for (let i = 0; i < 16; i++) {
      genes.push({
        left: Math.floor(Math.random() * 40),
        right: Math.floor(Math.random() * 40),
        up: Math.floor(Math.random() * 40),
        down: Math.floor(Math.random() * 40),
      });
    }
    return genes;
  }
}
const isGrounded = (haystack: Cell, heap: Array<Array<Cell | null>>) => {
  if (haystack.y === 0) return true;
  return heap[haystack.x][haystack.y - 1] != null;
};
interface ActiveTreeCell {
  cell: Cell;
  gene: TreeGene;
}
export class Tree {
  activeCells: ActiveTreeCell[];
  actorCells: Cell[];
  constructor(
    position: Cell,
    private readonly genes: TreeGene[],
    private readonly worldCells: Array<Array<Cell | null>>,
  ) {
    this.activeCells = [{cell: position, gene: genes[0]}];
    this.actorCells = [position];
  }

  grow(
    translateX: (x: number) => number,
    translateY: (y: number) => number,
    canGrow: (x: number, y: number, strength: number) => boolean,
  ) {
    // empty initial cells
    const newActorCells = this.actorCells.map(x => x);

    // fall if not grounded
    if (!isGrounded(newActorCells[0], this.worldCells)) {
      newActorCells.map(c => c.y--);
    } else {
      // otherwise grow
      const newActiveCells: ActiveTreeCell[] = [];
      const grow = (geneIndex: number, x: number, y: number) => {
        if (geneIndex < this.genes.length) {
          if (
            canGrow(x, y, newActorCells[0].strength) &&
            newActorCells.find(c => c.x === x && c.y === y) == null
          ) {
            const cell: Cell = {
              color: newActorCells[0].color,
              x,
              y,
              strength: newActorCells[0].strength,
            };
            const gene = this.genes[geneIndex];
            newActiveCells.push({cell, gene});
            newActorCells.push(cell);
          }
        }
      };
      for (const activeCell of this.activeCells) {
        grow(
          activeCell.gene.left,
          translateX(activeCell.cell.x - 1),
          activeCell.cell.y,
        );
        grow(
          activeCell.gene.right,
          translateX(activeCell.cell.x + 1),
          activeCell.cell.y,
        );
        grow(
          activeCell.gene.up,
          activeCell.cell.x,
          translateY(activeCell.cell.y + 1),
        );
        grow(
          activeCell.gene.down,
          activeCell.cell.x,
          translateY(activeCell.cell.y - 1),
        );
      }
      this.activeCells = newActiveCells;
    }
    this.actorCells = newActorCells;
  }
}
