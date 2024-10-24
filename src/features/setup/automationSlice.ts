// src/features/schedule/automationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AutomationState = {
  parameters: Record<string, string>;
};

// Create the slice
const automationSlice = createSlice({
  name: 'automation',
  initialState: {
    parameters: {},
  } as AutomationState,
  reducers: {
    setAutomationState: (state, action: PayloadAction<{ field: string; value: string }>) => {
      // Update only the specific field in the parameter object
      state.parameters[action.payload.field] = action.payload.value;
    },
    clearAutomationState: (state) => {
      state.parameters = {};
    }
  },
});

// Export the action to dispatch from components
export const { setAutomationState, clearAutomationState } = automationSlice.actions;

// Export the reducer to add to the store
export default automationSlice.reducer;
