// src/features/setup/jobSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Structure for User state
type UserState = {
    id: number;
    username: string;
    devices: string[];
};

// Create the slice
const userSlice = createSlice({
    name: 'user',
    initialState: {
        id: -1,
        username: 'N/A',
        devices: [],
    } as UserState,
    reducers: {
        // Reducer to update a specific field in the user state
        setUserState: (state, action: PayloadAction<UserState>) => {
            return action.payload;
        },
    },
});

// Export the action to dispatch from components
export const { setUserState } = userSlice.actions;

// Export the reducer to add to the store
export default userSlice.reducer;
