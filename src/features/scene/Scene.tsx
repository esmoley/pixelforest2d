import * as THREE from "three";
import {useEffect, useMemo, useRef} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {setLastUpdate, setLifetime} from "./sceneSlice";
import {World} from "./World";

const scale = 10;

interface SceneProps {
  width: number;
  height: number;
}
const scene = new THREE.Scene();

export const Scene = ({width, height}: SceneProps) => {
  const dispatch = useAppDispatch();
  const lifetime = useAppSelector(x => x.scene.lifetime);
  const lastUpdate = useAppSelector(x => x.scene.lastUpdate);
  const speed = useAppSelector(x => x.scene.speed);
  const started = useAppSelector(x => x.scene.started);

  const requestRef = useRef(0);
  const previousTimeRef = useRef(0);

  const camera = useMemo(
    () =>
      new THREE.OrthographicCamera(
        width / -scale,
        width / scale,
        height / scale,
        height / -scale,
        1,
        10,
      ),
    [],
  );
  const renderer = useMemo(() => new THREE.WebGLRenderer(), []);

  const render = () => {
    renderer.render(scene, camera);
  };

  const animate = (time: number) => {
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);

    if (started) {
      const deltaTime = Date.now() - lastUpdate;
      if (deltaTime * ((speed / 2) * 0.01) >= 1) {
        dispatch(setLastUpdate(Date.now()));
        dispatch(setLifetime(lifetime + 1));
      }
    }
  };

  useEffect(() => {
    renderer.setSize(width, height);
    document.body.appendChild(renderer.domElement);
    camera.position.x = 128;
    camera.position.y = 64;
    camera.position.z = 1;
  }, []);

  useEffect(() => {
    render();
  }, [started, lifetime]);
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  });

  return (
    <>
      <World key={1} render={render} scene={scene} />
    </>
  );
};
