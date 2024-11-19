// src/features/setup/automationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Automation } from '../../constants/types';

// Create the slice
const automationSlice = createSlice({
  name: 'automation',
  initialState: {
    id: -1,
    name: "",
    parameters: "",
    criteria: null,
  } as Automation,
  reducers: {
    setAutomation: (state, action: PayloadAction<Partial<Automation>>) => {
      return { ...state, ...action.payload };
    },
    clearAutomation: (state) => {
      state.id = -1;
      state.name = "";
      state.parameters = "";
      state.criteria = null;
    }
  },
});

// Export the action to dispatch from components
export const { setAutomation, clearAutomation } = automationSlice.actions;

// Export the reducer to add to the store
export default automationSlice.reducer;
