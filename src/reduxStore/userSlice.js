import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: null,
    user: null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        }
    }
})

export const { setToken, setUser } = userSlice.actions;

export default userSlice.reducer