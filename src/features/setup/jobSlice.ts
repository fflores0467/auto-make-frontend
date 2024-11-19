// src/features/setup/jobSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Job } from '../../constants/types';

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
    continuous: 0,
    arguments: {}
  } as Job,
  reducers: {
    // Reducer to set the job name
    setJob: (state, action: PayloadAction<Partial<Job>>) => {
      return { ...state, ...action.payload };
    },
    // Reducer to clear the job name
    clearJobName: (state) => {
      state.name = ''; // Clear the name
    },
    // Reducer to clear the arguments
    clearJobAutomation: (state) => {
      state.automation_id = -1
      state.arguments = {}; // Clear the arguments
    },
  }
});

// Export the action to dispatch from components
export const { setJob, clearJobName, clearJobAutomation } = jobSlice.actions;

// Export the reducer to add to the store
export default jobSlice.reducer;
