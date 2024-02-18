import {useEffect, useState} from "react";
import {useAppSelector} from "../../app/hooks";
import {type Cell} from "./World";

export class TreeGene {
  left = 0;
  right = 0;
  up = 0;
  down = 0;
}
interface ActiveTreeCell {
  cell: Cell;
  gene: TreeGene;
}
const isGrounded = (haystack: Cell, heap: Array<Array<Cell | null>>) => {
  if (haystack.y === 0) return true;
  return heap[haystack.x][haystack.y - 1] != null;
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
export interface TreeProps {
  initialCell: Cell;
  genes: TreeGene[];
  translateX: (x: number) => number;
  translateY: (y: number) => number;
  canGrow: (x: number, y: number, strength: number) => boolean;
  cells: Array<Array<Cell | null>>;
}
export const Tree = ({
  initialCell,
  genes,
  translateX,
  translateY,
  canGrow,
  cells,
}: TreeProps) => {
  const lifetime = useAppSelector(x => x.scene.lifetime);
  const [actorCells, setActorCells] = useState([initialCell]);
  const [activeCells, setActiveCells] = useState<ActiveTreeCell[]>([
    {cell: initialCell, gene: genes[0]},
  ]);

  useEffect(() => {
    // empty initial cells
    const newActorCells = actorCells.map(x => x);

    newActorCells.forEach(itemCell => (cells[itemCell.x][itemCell.y] = null));

    // fall if not grounded
    if (!isGrounded(newActorCells[0], cells)) {
      newActorCells.map(c => c.y--);
    } else {
      // otherwise grow
      const newActiveCells: ActiveTreeCell[] = [];
      const grow = (geneIndex: number, x: number, y: number) => {
        if (geneIndex < genes.length) {
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
            const gene = genes[geneIndex];
            newActiveCells.push({cell, gene});
            newActorCells.push(cell);
          }
        }
      };
      for (const activeCell of activeCells) {
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
      setActiveCells(newActiveCells);
    }
    setActorCells(newActorCells);
    // place cells
    newActorCells.map(itemCell => (cells[itemCell.x][itemCell.y] = itemCell));
  }, [lifetime]);

  return <></>;
};
