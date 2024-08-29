import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { url } from "../api";
import { jwtDecode } from 'jwt-decode';


export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (user, {rejectWithValue}) => {
        try{
            const token = await axios.post(`${url}/register`, {
                username: user.username,
                userrole: user.userrole,
                phone: user.phone,
                password: user.password,
            })

            localStorage.setItem('token', token.data);

            return token.data;

        }catch(err){
            console.log(err.response.data)
            return rejectWithValue(err.response.data);
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (user, {rejectWithValue}) => {
        try{
            const token = await axios.post(`${url}/login`, {
                username: user.username,
                password: user.password,
            })
            localStorage.setItem('token', token.data);
            return token.data;

        }catch(err){
            console.log(err.response.data)
            return rejectWithValue(err.response.data);
        }
    }
)

export const AuthSlice = createSlice ({
    name: 'auth',
    initialState:{
        token: localStorage.getItem('token'),
        username: '',
        user_id: '',
        isAdmin: false,
        role_id: '',
        registerStatus: '',
        registerError: '',
        loginStatus: '',
        loginError: '',
        userLoaded: false,
    },
    reducers: {
        loadUser(state) {
        const token = state.token;

        if (token) {
            try {
                const user = jwtDecode(token);

                return {
                    ...state,
                    token,
                    username: user.username,
                    user_id: user.user_id,
                    isAdmin: user.isAdmin,
                    role_id: user.role_id,
                    userLoaded: true,
                };
            } catch (error) {
                console.error('Invaluser_id token:', error.message);
                return {
                    ...state,
                    token: '',
                    userLoaded: true,
                };
            }
        } else {
            return { ...state, userLoaded: true };
        }
    },
        logoutUser(state) {
            localStorage.removeItem('token');

            return {
                ...state,
                token: '',
                username: '',
                user_id: '',
                isAdmin: false,
                role_id: '',
                registerStatus: '',
                registerError: '',
                loginStatus: '',
                loginError: '',
                userLoaded: false,
            };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(registerUser.pending, (state) => {
            return { ...state, registerStatus: 'pending'}
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            if(action.payload){
                const user = jwtDecode(action.payload);

                return {
                    ...state,
                    token: action.payload,
                    username: user.username,
                    user_id: user.user_id,
                    isAdmin: user.isAdmin,
                    role_id: user.role_id,
                    registerStatus: 'success',
                }
            } else return state;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            return{
                ...state,
                registerStatus: 'rejected',
                registerError: action.payload,
            }
        });

        builder.addCase(loginUser.pending, (state) => {
            return { ...state, loginStatus: 'pending'}
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            if(action.payload){
                const user = jwtDecode(action.payload);

                return {
                    ...state,
                    token: action.payload,
                    username: user.username,
                    user_id: user.user_id,
                    isAdmin: user.isAdmin,
                    role_id: user.role_id,
                    loginStatus: 'success',
                }
            } else return state;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            return{
                ...state,
                loginStatus: 'rejected',
                loginError: action.payload,
            }
        })
    },
})

export const { loadUser, logoutUser } = AuthSlice.actions;
