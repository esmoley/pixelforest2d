import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SceneState {
  lifetime:number,
  speed:number,
  lastUpdate:number,
  started:boolean,
  worldResetRequested:boolean,
  lockY:boolean,
  lockX:boolean
}

const initialState: SceneState = {
    lifetime: 0,
    speed:1,
    lastUpdate:0,
    started:false,
    worldResetRequested:true,
    lockY:true,
    lockX:false,
}

export const sceneSlice = createSlice({
  name: "scene",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setLifetime: (state, action:PayloadAction<number>) => {
        state.lifetime = action.payload
    },
    setSpeed: (state, action:PayloadAction<number>) => {
        state.speed = action.payload
    },
    setLastUpdate: (state, action:PayloadAction<number>) => {
        state.lastUpdate = action.payload
    },
    setStarted: (state, action:PayloadAction<boolean>) => {
        state.started = action.payload
    },
    setWorldResetRequested: (state, action:PayloadAction<boolean>) => {
      state.worldResetRequested = action.payload
    },
    setLockX: (state, action:PayloadAction<boolean>) => {
      state.lockX = action.payload
    },
    setLockY: (state, action:PayloadAction<boolean>) => {
      state.lockY = action.payload
    },
  },
})

export const {
  setLifetime,
  setSpeed,
  setLastUpdate,
  setStarted,
  setWorldResetRequested,
  setLockX,
  setLockY
} = sceneSlice.actions

export default sceneSlice.reducer
