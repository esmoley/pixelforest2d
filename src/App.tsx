import {useAppDispatch, useAppSelector} from "./app/hooks";
import {Scene} from "./features/scene/Scene";
import {
  setLockX,
  setLockY,
  setSpeed,
  setStarted,
  setWorldResetRequested,
} from "./features/scene/sceneSlice";

export const App = () => {
  const dispatch = useAppDispatch();

  const started = useAppSelector(x => x.scene.started);
  const lifetime = useAppSelector(x => x.scene.lifetime);
  const speed = useAppSelector(x => x.scene.speed);
  const lockX = useAppSelector(x => x.scene.lockX);
  const lockY = useAppSelector(x => x.scene.lockY);
  const finished = useAppSelector(x => x.scene.finished);
  return (
    <>
      <div
        className="flex justify-center pt-2"
        style={{
          height: "65px",
          backgroundColor: "#222222",
          color: "aliceblue",
        }}>
        <div className="flex-1">
          <div className="flex justify-start">
            <div
              style={{display: "block", fontFamily: "ReceiptionalReceipt"}}
              className="m-1 ml-1 cursor-pointer"
              onClick={() => dispatch(setLockX(!lockX))}>
              <div
                className="bg-slate-900 p-1 border-slate-500 border"
                style={{width: "fit-content", minWidth: "161.88px"}}>
                <span className="text-2xl select-none">lock X:{lockX ? "on" : "off"}</span>
              </div>
            </div>
            <div
              style={{display: "block", fontFamily: "ReceiptionalReceipt"}}
              className="m-1 ml-2 cursor-pointer"
              onClick={() => dispatch(setLockY(!lockY))}>
              <div
                className="bg-slate-900 p-1 border-slate-500 border"
                style={{width: "fit-content", minWidth: "161.88px"}}>
                <span className="text-2xl select-none">lock Y:{lockY ? "on" : "off"}</span>
              </div>
            </div>
            <div
              style={{display: "block", fontFamily: "ReceiptionalReceipt"}}
              className="m-1 ml-2 cursor-pointer"
              onClick={() => {
                if (speed >= 7) {
                  dispatch(setSpeed(1));
                } else {
                  dispatch(setSpeed(speed + 1));
                }
              }}>
              <div
                className="bg-slate-900 p-1 border-slate-500 border"
                style={{width: "fit-content"}}>
                <span className="text-2xl select-none">speed:{speed}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-initial">
          <button
            disabled={started || finished}
            className={
              "px-4 py-2 border border-red-500 text-red-500 transition-all duration-200" +
              (started
                ? " translate-y-[4px]"
                : " hover:text-white hover:bg-red-500 border-b-4")
            }
            onClick={() => {
              dispatch(setStarted(true));
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </button>
          <button
            disabled={!started}
            className={
              "px-4 py-2 border border-slate-500 text-slate-500 transition-all duration-200" +
              (!started
                ? " translate-y-[4px]"
                : " hover:text-white hover:bg-slate-500 border-b-4")
            }
            onClick={() => {
              dispatch(setStarted(false));
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25v13.5m-7.5-13.5v13.5"
              />
            </svg>
          </button>
          <button
            disabled={!started && lifetime === 0}
            className={
              "px-4 py-2 border border-slate-500 text-slate-500 transition-all duration-200" +
              (!started && lifetime === 0
                ? " translate-y-[4px]"
                : " hover:text-white hover:bg-slate-500 border-b-4")
            }
            onClick={() => {
              dispatch(setWorldResetRequested(true));
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1">
          <div
            style={{display: "block", fontFamily: "ReceiptionalReceipt"}}
            className="m-1 ml-3">
            <div
              className="bg-slate-900 p-1 border-slate-500 border"
              style={{width: "fit-content", minWidth: "161.88px"}}>
              <span className="text-2xl">time:{lifetime}</span>
            </div>
          </div>
        </div>
      </div>
      <Scene width={window.innerWidth} height={window.innerHeight - 65} />
    </>
  );
};
