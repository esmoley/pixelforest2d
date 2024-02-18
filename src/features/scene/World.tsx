import {useEffect, useMemo, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
  setFinished,
  setLifetime,
  setStarted,
  setWorldResetRequested,
} from "./sceneSlice";
import {Grid} from "./Grid";
import * as THREE from "three";
import {TreeGeneGenerator, Tree} from "./Tree";

interface FieldProps {
  scene: THREE.Scene;
  render: () => void;
}
export interface Cell {
  color: number;
  x: number;
  y: number;
  strength: number;
}

const colors = [
  0x5b5280, 0x6074ab, 0x74a0d1, 0x95c3e9, 0xc0e5f3, 0xfaffe0, 0xe3e0d7,
  0xc3b8b1, 0xa39391, 0x8d7176, 0x6a4c62, 0x4e3161, 0x421e42, 0x612447,
  0x7a3757, 0x96485b, 0xbd6868, 0xd18b79, 0xdbac8c, 0xe6cfa1, 0xe7ebbc,
  0xb2dba0, 0x87c293, 0x70a18f, 0x637c8f, 0xb56e75, 0xc98f8f, 0xdfb6ae,
  0xedd5ca, 0xbd7182, 0x9e5476, 0x753c6a,
];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
const initialColor = 0x000000;
const initialColorObj = new THREE.Color(initialColor);

const dummy = new THREE.Object3D();
const cells: Array<Array<Cell | null>> = [];

export const World = ({scene, render}: FieldProps) => {
  const dispatch = useAppDispatch();
  const width = useAppSelector(x => x.scene.width);
  const height = useAppSelector(x => x.scene.height);
  const instanceMesh: THREE.InstancedMesh = useMemo(() => {
    const res = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(),
      new THREE.MeshBasicMaterial(),
      width * height,
    );
    res.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    let meshIndex = 0;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        dummy.position.set(x, y, -1);
        dummy.updateMatrix();
        res.setColorAt(meshIndex, initialColorObj);
        res.setMatrixAt(meshIndex, dummy.matrix);
        meshIndex++;
      }
    }
    res.instanceMatrix.needsUpdate = true;
    scene.add(res);
    return res;
  }, []);
  useMemo(() => {
    const res = new Grid();
    res.width = width;
    res.height = height;
    scene.add(
      ...res.createLines(new THREE.LineBasicMaterial({color: 0x444444})),
    );
    return res;
  }, []);

  const lifetime = useAppSelector(x => x.scene.lifetime);
  const worldResetRequested = useAppSelector(x => x.scene.worldResetRequested);
  const lockX = useAppSelector(x => x.scene.lockX);
  const lockY = useAppSelector(x => x.scene.lockY);
  const [inactivity, setInactivity] = useState(0);
  const [trees, setTrees] = useState([] as Tree[]);

  const resetCells = () => {
    for (let x = 0; x < width; x++) {
      cells[x] = new Array(height).fill(null);
    }
  };
  const translateX = (x: number) => {
    if (lockX) return x;
    while (x < 0) x += width;
    while (x >= width) x -= width;
    return x;
  };
  const translateY = (y: number) => {
    if (lockY) return y;
    while (y < 0) y += height;
    while (y >= height) y -= height;
    return y;
  };
  const canGrow = (x: number, y: number, strength: number) => {
    if (lockY && (y < 0 || y >= height)) return false;
    if (lockX && (x < 0 || x >= width)) return false;
    return cells[x][y] == null; // || cells[x][y]!.strength<strength;
  };
  const paint = (): void => {
    let meshIndex = 0;
    const dummyColor = new THREE.Color(0x000000);
    let inactive = true;
    instanceMesh.getColorAt(meshIndex, dummyColor);
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        instanceMesh.getColorAt(meshIndex, dummyColor);
        if (cells[x][y] == null && !dummyColor.equals(initialColorObj)) {
          instanceMesh.setColorAt(meshIndex, initialColorObj);
          inactive = false;
        } else if (
          cells[x][y] != null &&
          cells[x][y]?.color !== dummyColor.getHex()
        ) {
          instanceMesh.setColorAt(
            meshIndex,
            new THREE.Color(cells[x][y]?.color),
          );
          inactive = false;
        }
        meshIndex++;
      }
    }
    if (inactive) {
      setInactivity(inactivity + 1);
      return;
    }
    if (instanceMesh.instanceColor != null)
      instanceMesh.instanceColor.needsUpdate = true;
  };

  // reset
  useEffect(() => {
    if (!worldResetRequested) return;
    setInactivity(0);
    dispatch(setStarted(false));
    dispatch(setFinished(false));
    dispatch(setLifetime(0));
    dispatch(setWorldResetRequested(false));
  }, [worldResetRequested]);
  useEffect(() => {
    if (lifetime !== 0) return;
    const randomX = (): number => Math.floor(Math.random() * width);
    const randomY = (): number => Math.floor(Math.random() * (height / 4));
    const newTrees: Tree[] = [];
    for (let i = 0; i < 32; i++) {
      const initialCell: Cell = {
        color: randomColor(),
        x: randomX(),
        y: randomY(),
        strength: Math.floor(Math.random() * 32),
      };
      newTrees.push(
        new Tree(initialCell, new TreeGeneGenerator().generate(), cells),
      );
    }
    setTrees(newTrees);
    resetCells();
    render();
  }, [lifetime === 0]);

  // update
  useEffect(() => {
    if (lifetime > 0) {
      trees.forEach(tree => {
        // empty tree cells from map
        tree.actorCells.forEach(
          itemCell => (cells[itemCell.x][itemCell.y] = null),
        );
        tree.grow(translateX, translateY, canGrow);
        // place cells to the map
        tree.actorCells.forEach(
          itemCell => (cells[itemCell.x][itemCell.y] = itemCell),
        );
      });
    }
    if (inactivity > 5 && lifetime >= inactivity) {
      dispatch(setStarted(false));
      dispatch(setFinished(true));
    }
    paint();
  }, [lifetime]);

  return <></>;
};
