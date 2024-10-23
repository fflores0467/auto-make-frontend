// src/features/schedule/scheduleSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Structure for Scheduler items
type ScheduleState = {
  name: string;
  start_date: Date;
  end_date: Date;
  interval: number;
  time_unit: string;
  specific_time: string;
  automation_id: number;
  isContinuous: number;
}

// Build start and end dates 
const start_date: Date = new Date();
const end_date: Date = new Date(start_date);
end_date.setDate(start_date.getDate() + 30);

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
    automation_id: 0,
    isContinuous: 0
  } as ScheduleState,
  reducers: {
    // Reducer to set the schedule name
    setScheduleState: (state, action: PayloadAction<Partial<ScheduleState>>) => {
      return {...state, ...action.payload };
    }
  }
});

// Export the action to dispatch from components
export const { setScheduleState } = scheduleSlice.actions;

// Export the reducer to add to the store
export default scheduleSlice.reducer;
