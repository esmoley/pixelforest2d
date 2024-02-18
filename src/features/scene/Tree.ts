import {type Cell} from "./World";

export class TreeGene {
  left = 0;
  right = 0;
  up = 0;
  down = 0;
}
export type TreeCell = Cell & {
  connected: boolean;
};
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
const isGrounded = (
  haystack: TreeCell,
  heap: Array<Array<TreeCell | null>>,
) => {
  if (haystack.y === 0) return true;
  return heap[haystack.x][haystack.y - 1] != null;
};
interface ActiveTreeCell {
  cell: TreeCell;
  gene: TreeGene;
}
export class Tree {
  activeCells: ActiveTreeCell[];
  actorCells: TreeCell[];
  worldCells: Array<Array<TreeCell | null>>;
  constructor(
    position: TreeCell,
    private readonly genes: TreeGene[],
    worldCells: Array<Array<TreeCell | null>>,
  ) {
    this.worldCells = worldCells;
    position.parent = this;
    const treeCell = position;
    treeCell.connected = true;
    this.activeCells = [{cell: treeCell, gene: genes[0]}];
    this.actorCells = [treeCell];
  }

  grow(
    translateX: (x: number) => number,
    translateY: (y: number) => number,
    canGrow: (x: number, y: number, strength: number) => boolean,
  ) {
    if (this.actorCells.length === 0) return;
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
            const cell: TreeCell = {
              color: newActorCells[0].color,
              x,
              y,
              strength: newActorCells[0].strength,
              parent: this,
              connected: true,
            };
            const gene = this.genes[geneIndex];
            newActiveCells.push({cell, gene});
            newActorCells.push(cell);
          }
        }
      };
      this.activeCells.forEach(activeCell => {
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
      });
      this.activeCells = newActiveCells;
    }
    this.actorCells = newActorCells;
  }

  private removeCell(cell: TreeCell) {
    this.activeCells = this.activeCells.filter(c => c.cell !== cell);
    this.actorCells = this.actorCells.filter(c => c !== cell);
  }

  private findDisconnectedCells(
    translateX: (x: number) => number,
    translateY: (y: number) => number,
  ) {
    const cellsMap: Record<number, Record<number, TreeCell | null>> = [];

    this.actorCells.forEach(c => {
      if (!cellsMap[c.x]) cellsMap[c.x] = [];
      cellsMap[c.x][c.y] = c;
    });

    const connectedCells: Array<TreeCell | null> = [];

    const appendConnectedCells = (fromCell: TreeCell | null) => {
      if (!fromCell || connectedCells.find(c => c === fromCell) != null) return;
      connectedCells.push(fromCell);
      let cellsMapX = cellsMap[translateX(fromCell.x - 1)];
      if (cellsMapX) appendConnectedCells(cellsMapX[fromCell.y]);
      cellsMapX = cellsMap[translateX(fromCell.x + 1)];
      if (cellsMapX) appendConnectedCells(cellsMapX[fromCell.y]);
      cellsMapX = cellsMap[fromCell.x];
      if (cellsMapX) {
        appendConnectedCells(cellsMapX[translateY(fromCell.y - 1)]);
        appendConnectedCells(cellsMapX[translateY(fromCell.y + 1)]);
      }
    };
    appendConnectedCells(this.actorCells[0]);

    return this.actorCells.filter(
      c => connectedCells.find(cc => cc === c) == null,
    );
  }

  deleteCell(cell: TreeCell) {
    this.removeCell(cell);
    // this.findDisconnectedCells(translateX, translateY).forEach(c=>this.removeCell(c))
  }

  clearDisconnected(
    translateX: (x: number) => number,
    translateY: (y: number) => number,
  ) {
    this.findDisconnectedCells(translateX, translateY).forEach(c => {
      this.removeCell(c);
    });
  }
}
