import {configureStore, type ThunkAction, type Action} from "@reduxjs/toolkit";
import sceneSlice from "../features/scene/sceneSlice";

export const CreateStore = () =>
  configureStore({
    reducer: {
      scene: sceneSlice,
    },
  });

export const store = CreateStore();
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = any> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
