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
    lastAttended:string
};


const initialState = {
    value: {
        id:"",
        registration_no:"",
        email: "",
       name:"",
       token:"",
       section:"",
       branch:"",
       lastAttended: "",
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
       
        resetProfile: (state) => {
            state.value = {
              ...initialState.value,
              lastAttended: state.value.lastAttended, // Preserve the lastAttended field
            };
          },// Reset profile to initial state
    },
});

export const { updateProfile, resetProfile } = profile.actions;
export default profile.reducer;