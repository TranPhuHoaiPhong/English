import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import { loadState, saveState } from "./persist";

const preloadedState = loadState();

export const store = configureStore({
    reducer: {
        counter: counterReducer,
    },
    preloadedState,
});

store.subscribe(() => {
    saveState({
        counter: store.getState().counter,
    })
})