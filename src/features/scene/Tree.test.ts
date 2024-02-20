import {assert, describe, test} from "vitest";
import {Tree, type TreeCell, type TreeGene} from "./Tree";

const width = 10;
const height = 10;
const translateX = (x: number) => {
  while (x < 0) x += width;
  while (x >= width) x -= width;
  return x;
};
const translateY = (y: number) => {
  while (y < 0) y += height;
  while (y >= height) y -= height;
  return y;
};
const canGrow = () => true;
describe("tree", () => {
  test("thin tree cells should be destroyed when not connected", () => {
    const worldCells: Array<Array<TreeCell | null>> = [];
    for (let x = 0; x < width; x++) {
      worldCells[x] = new Array(height).fill(null);
    }
    const position: TreeCell = {
      color: 5,
      strength: 5,
      x: 0,
      y: 0,
      connected: true,
    };
    const genes: TreeGene[] = [
      {down: 30, up: 1, left: 30, right: 30},
      {down: 30, up: 2, left: 30, right: 30},
      {down: 30, up: 3, left: 3, right: 30},
      {down: 30, up: 4, left: 30, right: 30},
    ];

    const tree = new Tree(position, genes, worldCells);
    tree.grow(translateX, translateY, canGrow);
    tree.grow(translateX, translateY, canGrow);
    tree.grow(translateX, translateY, canGrow);
    assert.equal(tree.actorCells.length, 5);
    assert.equal(tree.activeCells.length, 2);

    tree.deleteCell(tree.actorCells[2]);
    tree.clearDisconnected(translateX, translateY);
    assert.equal(tree.actorCells.length, 2);
    assert.equal(tree.activeCells.length, 0);
  });
  test("thick tree cells should be destroyed when not connected", () => {
    const worldCells: Array<Array<TreeCell | null>> = [];
    for (let x = 0; x < width; x++) {
      worldCells[x] = new Array(height).fill(null);
    }
    const position: TreeCell = {
      color: 5,
      strength: 5,
      x: 0,
      y: 0,
      connected: true,
    };
    const genes: TreeGene[] = [
      {down: 30, up: 1, left: 1, right: 30},
      {down: 30, up: 2, left: 30, right: 30},
      {down: 30, up: 3, left: 30, right: 30},
      {down: 30, up: 4, left: 30, right: 30},
    ];

    const tree = new Tree(position, genes, worldCells);
    tree.grow(translateX, translateY, canGrow);
    // o8
    tree.grow(translateX, translateY, canGrow);
    //  o
    // 88
    tree.grow(translateX, translateY, canGrow);
    // o8
    // 88
    assert.equal(tree.actorCells.length, 7);
    assert.equal(tree.activeCells.length, 2);
    let foundCell = tree.actorCells.find(
      c => c.x === translateX(-1) && c.y === 1,
    )!;
    tree.deleteCell(foundCell);
    // o8
    // o8
    assert.equal(tree.actorCells.length, 6);
    assert.equal(tree.activeCells.length, 2);
    foundCell = tree.actorCells.find(c => c.x === 0 && c.y === 1)!;
    tree.deleteCell(foundCell);
    tree.clearDisconnected(translateX, translateY);
    // o8   =>
    // oo   =>  oo
    assert.equal(tree.actorCells.length, 2);
    assert.equal(tree.activeCells.length, 0);
  });
});
