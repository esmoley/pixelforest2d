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
import {type TreeGene, TreeGeneGenerator, Tree} from "./Tree";

interface FieldProps {
  scene: THREE.Scene;
  render: () => void;
}
export interface Cell {
  color: string;
  x: number;
  y: number;
}

const colors = [
  "#5B5280",
  "#6074AB",
  "#74A0D1",
  "#95C3E9",
  "#C0E5F3",
  "#FAFFE0",
  "#E3E0D7",
  "#C3B8B1",
  "#A39391",
  "#8D7176",
  "#6A4C62",
  "#4E3161",
  "#421E42",
  "#612447",
  "#7A3757",
  "#96485B",
  "#BD6868",
  "#D18B79",
  "#DBAC8C",
  "#E6CFA1",
  "#E7EBBC",
  "#B2DBA0",
  "#87C293",
  "#70A18F",
  "#637C8F",
  "#B56E75",
  "#C98F8F",
  "#DFB6AE",
  "#EDD5CA",
  "#BD7182",
  "#9E5476",
  "#753C6A",
];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];
const initialColor = "#000000";
const initialColorObj = new THREE.Color(initialColor);

const dummy = new THREE.Object3D();
const cells: Array<Array<Cell | null>> = [];

interface TreeState {
  key: number;
  initialCell: Cell;
  genes: TreeGene[];
}

export const World = ({scene, render}: FieldProps) => {
  const dispatch = useAppDispatch();
  const width = useAppSelector(x => x.scene.width);
  const height = useAppSelector(x => x.scene.height);
  const started = useAppSelector(x => x.scene.started);
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
  const [trees, setTrees] = useState([] as TreeState[]);

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
  const isCellEmpty = (x: number, y: number) => {
    if (lockY && (y < 0 || y >= height)) return false;
    if (lockX && (x < 0 || x >= width)) return false;
    return cells[x][y] == null;
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
          cells[x][y]?.color !== "#" + dummyColor.getHexString().toUpperCase()
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
    const newTrees = [];
    for (let i = 0; i < 32; i++) {
      newTrees.push({
        key: Math.random(),
        initialCell: {color: randomColor(), x: randomX(), y: randomY()},
        genes: new TreeGeneGenerator().generate(),
      });
    }
    setTrees(newTrees);
    resetCells();
    render();
  }, [lifetime === 0]);

  useEffect(() => {
    if (!started) return;
    dispatch(setFinished(true));
  }, [started]);

  // update
  useEffect(() => {
    if (inactivity > 5 && lifetime >= inactivity) {
      dispatch(setStarted(false));
    }
    paint();
  }, [lifetime]);

  return (
    <>
      {trees.map(tree => (
        <Tree
          initialCell={tree.initialCell}
          genes={tree.genes}
          key={tree.key}
          isCellEmpty={isCellEmpty}
          translateX={translateX}
          translateY={translateY}
          cells={cells}
        />
      ))}
    </>
  );
};
