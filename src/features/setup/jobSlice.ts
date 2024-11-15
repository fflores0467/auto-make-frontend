// src/features/setup/jobSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Structure for Job items
type JobState = {
  name: string;
  start_date: string;
  end_date: string;
  interval: number | string;
  time_unit: string;
  specific_time: string;
  automation_id: number;
  user_id: number;
  continuous: number;
}

// Build start and end dates 
const start_date: string = new Date().toISOString().split("T")[0];
const end_date: string = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0];

// Create the slice
const jobSlice = createSlice({
  name: 'job',
  initialState: {
    name: '',
    start_date,
    end_date,
    interval: 5,
    time_unit: 'minutes',
    specific_time: ':00',
    automation_id: -1,
    user_id: -1,
    continuous: 0
  } as JobState,
  reducers: {
    // Reducer to set the job name
    setJobState: (state, action: PayloadAction<Partial<JobState>>) => {
      return { ...state, ...action.payload };
    },
    // Reducer to clear the job name
    clearJobName: (state) => {
      state.name = ''; // Clear the name
    },
  }
});

// Export the action to dispatch from components
export const { setJobState, clearJobName } = jobSlice.actions;

// Export the reducer to add to the store
export default jobSlice.reducer;
