// src/store.ts
import { configureStore } from '@reduxjs/toolkit'
import jobReducer from './features/setup/jobSlice' // Import the job slice
import automationReducer from './features/setup/automationSlice'
import userReducer from './features/login/userSlice'

export const store = configureStore({
  reducer: {
    job: jobReducer, // Add the job reducer to the store
    automation: automationReducer,
    user: userReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
