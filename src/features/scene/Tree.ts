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
  actorCellsMap: Array<Array<TreeCell | null>>;
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

    this.actorCellsMap = new Array(worldCells.length).fill(
      new Array(worldCells[0].length),
    );
    this.actorCellsMap[treeCell.x][treeCell.y] = treeCell;
  }

  grow(
    translateX: (x: number) => number,
    translateY: (y: number) => number,
    canGrow: (x: number, y: number, strength: number) => boolean,
  ) {
    if (this.actorCells.length === 0) return;

    // fall if not grounded
    if (!isGrounded(this.actorCells[0], this.worldCells)) {
      this.actorCells.forEach(c => {
        this.actorCellsMap[c.x][c.y] = null;
        this.actorCellsMap[c.x][c.y - 1] = c;
        c.y--;
      });
    } else {
      // otherwise grow
      const newActiveCells: ActiveTreeCell[] = [];
      const grow = (geneIndex: number, x: number, y: number) => {
        if (geneIndex < this.genes.length) {
          if (
            canGrow(x, y, this.actorCells[0].strength) &&
            this.actorCells.find(c => c.x === x && c.y === y) == null
          ) {
            const cell: TreeCell = {
              color: this.actorCells[0].color,
              x,
              y,
              strength: this.actorCells[0].strength,
              parent: this,
              connected: true,
            };
            const gene = this.genes[geneIndex];
            newActiveCells.push({cell, gene});
            this.actorCells.push(cell);
            this.actorCellsMap[cell.x][cell.y] = cell;
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
  }

  private removeCell(cell: TreeCell) {
    this.activeCells = this.activeCells.filter(c => c.cell !== cell);
    this.actorCells = this.actorCells.filter(c => c !== cell);
    this.actorCellsMap[cell.x][cell.y] = null;
  }

  private findDisconnectedCells(
    translateX: (x: number) => number,
    translateY: (y: number) => number,
  ) {
    const connectedCells: Array<TreeCell | null> = [];

    const appendConnectedCells = (fromCell: TreeCell | null) => {
      if (!fromCell || connectedCells.find(c => c === fromCell) != null) return;
      connectedCells.push(fromCell);
      let cellsMapX = this.actorCellsMap[translateX(fromCell.x - 1)];
      if (cellsMapX) appendConnectedCells(cellsMapX[fromCell.y]);
      cellsMapX = this.actorCellsMap[translateX(fromCell.x + 1)];
      if (cellsMapX) appendConnectedCells(cellsMapX[fromCell.y]);
      cellsMapX = this.actorCellsMap[fromCell.x];
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
