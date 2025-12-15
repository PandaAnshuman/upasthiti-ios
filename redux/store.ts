import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { useSelector, TypedUseSelectorHook } from 'react-redux'
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist' // Import constants
import storage from 'redux-persist/lib/storage'
import profileReducer from './features/profile-slice'

const persistConfigure = {
    key: 'persist-store',
    version: 1,
    storage
}

const reducer = combineReducers({
    profileReducer,
})

const persistedReducer = persistReducer(persistConfigure, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    // 👇 Add this middleware configuration
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                // Optionally, ignore specific paths for certain actions if needed, 
                // but the ignoredActions list usually suffices for redux-persist.
                // ignoredPaths: ['some.path.with.nonSerializableValue'],
            },
        }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;