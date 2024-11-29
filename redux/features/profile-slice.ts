import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type InitialState = {
    value: UserProfileState;
};

type UserProfileState = {
    id: string;
    registration_no: string;
    email: string;
    name: string;
    token: string;
    section: string;
    branch: string;
};

const initialState = {
    value: {
        id:"",
        registration_no:"",
        email: "",
       name:"",
       token:"",
       section:"",
       branch:""

        
    } as UserProfileState,
} as InitialState;

export const profile = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateProfile: (state, action: PayloadAction<Partial<UserProfileState>>) => {
            // Update only the provided fields in the action payload
            state.value = { ...state.value, ...action.payload };
        },
       
        resetProfile: () => initialState, // Reset profile to initial state
    },
});

export const { updateProfile, resetProfile } = profile.actions;
export default profile.reducer;