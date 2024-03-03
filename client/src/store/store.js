// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import userReducer from "./userSlice";
import websiteReducer from "./websiteSlice";
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "website"], // List of reducers you want to persist; 'user' in this case
};

const rootReducer = combineReducers({
  user: userReducer,
  website: websiteReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
