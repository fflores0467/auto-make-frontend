// src/store.ts
import { configureStore } from '@reduxjs/toolkit'
import scheduleReducer from './features/schedule/scheduleSlice' // Import the schedule slice

export const store = configureStore({
  reducer: {
    schedule: scheduleReducer, // Add the schedule reducer to the store
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
