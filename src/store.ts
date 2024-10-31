// src/store.ts
import { configureStore } from '@reduxjs/toolkit'
import scheduleReducer from './features/setup/scheduleSlice' // Import the schedule slice
import automationReducer from './features/setup/automationSlice' // Import the schedule slice


export const store = configureStore({
  reducer: {
    schedule: scheduleReducer, // Add the schedule reducer to the store
    automation: automationReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
