import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

const initialWidth = 256;
const initialHeight = 128;
export interface SceneState {
  width: number;
  height: number;
  lifetime: number;
  speed: number;
  lastUpdate: number;
  started: boolean;
  worldResetRequested: boolean;
  lockY: boolean;
  lockX: boolean;
  finished: boolean;
}

const initialState: SceneState = {
  width: initialWidth,
  height: initialHeight,
  lifetime: 0,
  speed: 1,
  lastUpdate: 0,
  started: false,
  worldResetRequested: true,
  lockY: true,
  lockX: false,
  finished: false,
};

export const sceneSlice = createSlice({
  name: "scene",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLifetime: (state, action: PayloadAction<number>) => {
      state.lifetime = action.payload;
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    setLastUpdate: (state, action: PayloadAction<number>) => {
      state.lastUpdate = action.payload;
    },
    setStarted: (state, action: PayloadAction<boolean>) => {
      state.started = action.payload;
    },
    setWorldResetRequested: (state, action: PayloadAction<boolean>) => {
      state.worldResetRequested = action.payload;
    },
    setLockX: (state, action: PayloadAction<boolean>) => {
      state.lockX = action.payload;
    },
    setLockY: (state, action: PayloadAction<boolean>) => {
      state.lockY = action.payload;
    },
    setFinished: (state, action: PayloadAction<boolean>) => {
      state.finished = action.payload;
    },
  },
});

export const {
  setLifetime,
  setSpeed,
  setLastUpdate,
  setStarted,
  setWorldResetRequested,
  setLockX,
  setLockY,
  setFinished,
} = sceneSlice.actions;

export default sceneSlice.reducer;
