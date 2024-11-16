import { createSlice } from '@reduxjs/toolkit';

// Define the initial state
const initialState = {
    userInfo: localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo') as string)
        : null,
};

// Create the slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            // Store user info in localStorage
            localStorage.setItem('userInfo', JSON.stringify(action.payload));
            
            // Set expiration time to 30 days from now
            const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
            localStorage.setItem('expirationTime', expirationTime.toString());
            
            // Update the userInfo state
            state.userInfo = action.payload;
        },

        logout: (state) => {
            // Clear user info from localStorage
            localStorage.removeItem('userInfo');
            localStorage.removeItem('expirationTime');
            
            // Set userInfo in state to null
            state.userInfo = null;
        },
    },
});

// Export the actions
export const { setCredentials, logout } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;
