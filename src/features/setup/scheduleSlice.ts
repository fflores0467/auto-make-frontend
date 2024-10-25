// src/features/schedule/scheduleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Structure for Scheduler items
type ScheduleState = {
  name: string;
  start_date: string;
  end_date: string;
  interval: number;
  time_unit: string;
  specific_time: string;
  automation_id: number;
  isContinuous: number;
}

// Build start and end dates 
const start_date: string = new Date().toISOString().split("T")[0];
const end_date: string = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];

// Create the slice
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState: {
    name: '',
    start_date,
    end_date,
    interval: 5,
    time_unit: 'minutes',
    specific_time: ':00',
    automation_id: -1,
    isContinuous: 0
  } as ScheduleState,
  reducers: {
    // Reducer to set the schedule name
    setScheduleState: (state, action: PayloadAction<Partial<ScheduleState>>) => {
      return {...state, ...action.payload };
    },
    // Reducer to clear the schedule name
    clearScheduleName: (state) => {
      state.name = ''; // Clear the name
    },
  }
});

// Export the action to dispatch from components
export const { setScheduleState, clearScheduleName } = scheduleSlice.actions;

// Export the reducer to add to the store
export default scheduleSlice.reducer;
