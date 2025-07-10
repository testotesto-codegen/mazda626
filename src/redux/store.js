import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { api } from '../api/api';
import { persistReducer, persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import widgetsReducer from './slices/widgetSlice';
import modalReducer from './slices/modalSlice';
import themeReducer from './slices/themeSlice';
import stockDetailModalReducer from './slices/stockDetailModalSlice';
import portfolioReducer from './slices/portfolioSlice';
import newsReducer from './slices/newsSlice';

import tickerSessionsReducer from './slices/tickerSessionsSlice';
import lboFilesReducer from './slices/lboFilesSlice';
// Custom logger for Redux persist
const persistLogger = (store) => (next) => (action) => {
    if (action.type === REHYDRATE) {
        console.log("Redux Persist: REHYDRATE action:", action);
    }
    return next(action);
};

const persistConfig = {
	key: "root",
	storage, // Uses localStorage by default
	whitelist: ["auth", "tickerSessions", "widgets", "portfolio"], // Removed user from persist
    debug: true, // Enable debug mode for redux-persist
};

const rootReducer = combineReducers({
	auth: authReducer,
	user: userReducer,
	[api.reducerPath]: api.reducer,
	widgets: widgetsReducer,
	modal: modalReducer,
	theme: themeReducer,
	stockModal: stockDetailModalReducer,
	portfolio: portfolioReducer,
	news: newsReducer,
	tickerSessions: tickerSessionsReducer,
	lboFiles: lboFilesReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
	getDefaultMiddleware({
		serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
	}).concat(api.middleware, persistLogger),
	devTools: true,
});

// 🔄 Persistor
const persistor = persistStore(store, null, () => {
    console.log("Redux persist: Rehydration completed");
    console.log("Redux persist: Current state after rehydration:", store.getState());
});

export { store, persistor };
