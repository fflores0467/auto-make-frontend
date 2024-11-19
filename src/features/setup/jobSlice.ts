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
    // Reducer to set the Job back to default state
    clearJob: (state) => {
      state.name = '';
      state.start_date = start_date;
      state.end_date = end_date;
      state.interval = 5;
      state.time_unit = 'minutes';
      state.specific_time = ':00';
      state.automation_id = -1;
      state.continuous = 0;
      state.arguments = {};
    },
    // Reducer to clear the arguments
    clearJobAutomation: (state) => {
      state.automation_id = -1
      state.arguments = {}; // Clear the arguments
    },
  }
});

// Export the action to dispatch from components
export const { setJob, clearJob, clearJobAutomation } = jobSlice.actions;

// Export the reducer to add to the store
export default jobSlice.reducer;
